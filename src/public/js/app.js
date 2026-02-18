const table = document.getElementById("foodTable");
const analyzeSelectedBtn = document.getElementById("analyzeSelectedBtn");
const analyzeAllBtn = document.getElementById("analyzeAllBtn");

let foodsData = [];
let selectedFoods = new Set();
const THRESHOLD = 70;

async function fetchFoods() {
  const res = await fetch("/api/foods?t=" + Date.now());
  return res.json();
}


async function renderTable() {
  foodsData = await fetchFoods();
  table.innerHTML = "";

  foodsData.forEach(food => {

    let imageIndex = 0;

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>
        <input type="checkbox" onchange="toggleSelect('${food._id}')">
      </td>

      <td>
        <div class="image-wrapper">
          <img id="img-${food._id}" src="${food.images?.[0] || ''}" />
          <button class="slider-btn slider-left"
            onclick="changeImage('${food._id}', -1)">‹</button>
          <button class="slider-btn slider-right"
            onclick="changeImage('${food._id}', 1)">›</button>
        </div>
      </td>

      <td>${food.name}</td>

      <td style="white-space:normal;">
        ${food.description}
      </td>

      <td>${food.isVeg ? "Veg" : "Non-Veg"}</td>

      <td id="result-${food._id}">Pending</td>

      <td id="human-${food._id}">-</td>
    `;

    table.appendChild(row);
  });
}

window.toggleSelect = function(id) {
  if (selectedFoods.has(id)) {
    selectedFoods.delete(id);
  } else {
    selectedFoods.add(id);
  }

  analyzeSelectedBtn.disabled = selectedFoods.size === 0;
};

window.changeImage = function(id, direction) {
  const food = foodsData.find(f => f._id === id);
  const img = document.getElementById(`img-${id}`);

  let currentIndex = food.images.indexOf(img.src.replace(window.location.origin,""));

  if (currentIndex === -1) currentIndex = 0;

  currentIndex += direction;

  if (currentIndex < 0) currentIndex = food.images.length - 1;
  if (currentIndex >= food.images.length) currentIndex = 0;

  img.src = food.images[currentIndex];
};

analyzeSelectedBtn.addEventListener("click", async () => {
  for (let id of selectedFoods) {
    const food = foodsData.find(f => f._id === id);
    await analyzeFood(food);
  }
});

analyzeAllBtn.addEventListener("click", async () => {
  for (let food of foodsData) {
    await analyzeFood(food);
  }
});

async function analyzeFood(food) {

  const resultCell = document.getElementById(`result-${food._id}`);
  const humanCell = document.getElementById(`human-${food._id}`);

  resultCell.innerText = "Analyzing...";

  let lowestScore = 100;
  let failedImage = null;

  for (let imageUrl of food.images) {

    const res = await fetch("/api/analyze/existing", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        imageUrl,
        name:food.name,
        description:food.description,
        isVeg:food.isVeg
      })
    });

    const data = await res.json();

    let cleaned = data.result.replace(/```json|```/g,"").trim();
    const parsed = JSON.parse(cleaned);

    if (parsed.final_confidence < lowestScore) {
      lowestScore = parsed.final_confidence;
      failedImage = imageUrl;
    }
  }

  if (lowestScore >= THRESHOLD) {
    resultCell.innerHTML = `<span class="pass">${lowestScore}% PASS</span>`;
    humanCell.innerText = "Not Required";
  } else {
    resultCell.innerHTML = `
      <span class="fail">${lowestScore}% FAIL</span><br/>
      Image: ${failedImage}
    `;

    humanCell.innerHTML = `
      <button onclick="approve('${food._id}')">Approve</button>
      <button onclick="reject('${food._id}')">Reject</button>
    `;
  }
}

window.approve = function(id) {
  document.getElementById(`human-${id}`).innerHTML =
    `<span class="human">Approved by Human</span>`;
};

window.reject = function(id) {
  document.getElementById(`human-${id}`).innerHTML =
    `<span class="fail">Rejected by Human</span>`;
};

window.onload = renderTable;
