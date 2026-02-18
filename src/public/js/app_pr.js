const table = document.getElementById("foodTable");
const analyzeSelectedBtn = document.getElementById("analyzeSelectedBtn");
const analyzeAllBtn = document.getElementById("analyzeAllBtn");

let foodsData = [];
let selectedFoods = new Set();
let imageIndexes = {};
const THRESHOLD = 70;

async function fetchFoods() {
  const res = await fetch("/api/foods?t=" + Date.now());
  return res.json();
}

async function renderTable() {
  foodsData = await fetchFoods();
  table.innerHTML = "";

  foodsData.forEach(food => {

    imageIndexes[food._id] = 0;

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>
        <input type="checkbox" onchange="toggleSelect('${food._id}')">
      </td>

      <td>
        <div class="image-wrapper">
          <div class="badge-blur" id="blur-${food._id}" style="display:none;">BLUR</div>

          <div class="carousel-track" id="track-${food._id}">
            ${food.images.map(img => `<img src="${img}" />`).join("")}
          </div>

          ${food.images.length > 1 ? `
            <button class="slider-btn slider-left"
              onclick="changeImage('${food._id}', -1)">‹</button>
            <button class="slider-btn slider-right"
              onclick="changeImage('${food._id}', 1)">›</button>
          ` : ""}
        </div>

        <div class="dots" id="dots-${food._id}">
          ${food.images.map((_, i) =>
            `<span class="dot ${i===0?'active':''}"
              id="dot-${food._id}-${i}"
              onclick="goToImage('${food._id}', ${i})">-</span>`
          ).join("")}
        </div>
      </td>

      <td>${food.name}</td>
      <td>${food.description}</td>
      <td>${food.isVeg ? "Veg" : "Non-Veg"}</td>
      <td id="result-${food._id}">Pending</td>
      <td id="human-${food._id}">-</td>
    `;

    table.appendChild(row);
  });
}

/* ===============================
   IMAGE CAROUSEL
================================ */

window.changeImage = function(id, direction) {
  const food = foodsData.find(f => f._id === id);
  if (!food) return;

  imageIndexes[id] += direction;

  if (imageIndexes[id] < 0)
    imageIndexes[id] = food.images.length - 1;

  if (imageIndexes[id] >= food.images.length)
    imageIndexes[id] = 0;

  updateCarousel(id);
};

window.goToImage = function(id, index) {
  imageIndexes[id] = index;
  updateCarousel(id);
};

function updateCarousel(id) {
  const track = document.getElementById(`track-${id}`);
  const dots = document.querySelectorAll(`#dots-${id} .dot`);
  const index = imageIndexes[id];

  track.style.transform = `translateX(-${index * 200}px)`;

  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });
}

/* ===============================
   SELECTION
================================ */

window.toggleSelect = function(id) {
  if (selectedFoods.has(id))
    selectedFoods.delete(id);
  else
    selectedFoods.add(id);

  analyzeSelectedBtn.disabled = selectedFoods.size === 0;
};

/* ===============================
   PARALLEL ANALYSIS
================================ */

async function analyzeFood(food) {

  const resultCell = document.getElementById(`result-${food._id}`);
  const humanCell = document.getElementById(`human-${food._id}`);
  const blurBadge = document.getElementById(`blur-${food._id}`);

  resultCell.innerText = "Analyzing...";
  humanCell.innerText = "-";
  blurBadge.style.display = "none";

  let lowestScore = 100;
  let blurDetected = false;

  // ⚡ PARALLEL CALLS
  const promises = food.images.map((imageUrl, index) =>
    fetch("/api/analyze/existing", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        imageUrl,
        name:food.name,
        description:food.description,
        isVeg:food.isVeg
      })
    })
    .then(res => res.json())
    .then(data => {

      let cleaned = data.result.replace(/```json|```/g,"").trim();
      const parsed = JSON.parse(cleaned);

      // 📊 Update dot score immediately (progressive UX)
      const dot = document.getElementById(`dot-${food._id}-${index}`);
      dot.innerText = parsed.final_confidence + "%";

      if (parsed.clarity < 50)
        blurDetected = true;

      if (parsed.final_confidence < lowestScore)
        lowestScore = parsed.final_confidence;

    })
    .catch(err => {
      console.error("LLM Error:", err);
    })
  );

  // Wait for all
  await Promise.all(promises);

  if (blurDetected)
    blurBadge.style.display = "block";

  /* ===============================
     HUMAN LOOP RESTORED
  ================================ */

  if (lowestScore >= THRESHOLD) {
    resultCell.innerHTML =
      `<span class="pass">${lowestScore}% PASS</span>`;
    humanCell.innerText = "Not Required";
  } else {
    resultCell.innerHTML =
      `<span class="fail">${lowestScore}% FAIL</span>`;

    humanCell.innerHTML = `
      <button onclick="approve('${food._id}')">Approve</button>
      <button onclick="reject('${food._id}')">Reject</button>
    `;
  }
}

/* ===============================
   HUMAN REVIEW
================================ */

window.approve = function(id) {
  document.getElementById(`human-${id}`).innerHTML =
    `<span class="human">Approved by Human</span>`;
};

window.reject = function(id) {
  document.getElementById(`human-${id}`).innerHTML =
    `<span class="fail">Rejected by Human</span>`;
};

/* ===============================
   BUTTON HANDLERS
================================ */

analyzeSelectedBtn.addEventListener("click", async () => {
  for (let id of selectedFoods) {
    const food = foodsData.find(f => f._id === id);
    await analyzeFood(food);
  }
});

analyzeAllBtn.addEventListener("click", async () => {
  for (let food of foodsData)
    await analyzeFood(food);
});

window.onload = renderTable;
