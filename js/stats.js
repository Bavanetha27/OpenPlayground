/**
 * Fetch projects using the manifest system (similar to app.js)
 */
async function fetchProjects() {
  try {
    const manifestResponse = await fetch('./project-manifest.json');
    if (!manifestResponse.ok) throw new Error('Manifest not found');

    const manifest = await manifestResponse.json();
    const projectPromises = manifest.projects.map(async (entry) => {
      try {
        const response = await fetch(entry.path);
        if (!response.ok) return null;
        return await response.json();
      } catch (e) {
        return null;
      }
    });

    const results = await Promise.all(projectPromises);
    return results.filter(p => p !== null);
  } catch (e) {
    // Fallback to legacy projects.json if manifest fails
    const response = await fetch('./projects.json');
    return await response.json();
  }
}

fetchProjects()
  .then(projects => {
    // Count unique projects and categories
    const seenTitles = new Set();
    const categoryCount = {};

    projects.forEach(project => {
      const title = project.title ? project.title.trim() : '';
      if (!title) return;

      const titleKey = title.toLowerCase();
      if (seenTitles.has(titleKey)) return;
      seenTitles.add(titleKey);

      let category = (project.category || 'other')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '_');

      const pluralMap = {
        'games': 'game',
        'puzzles': 'puzzle',
        'utilities': 'utility'
      };
      category = pluralMap[category] || category;

      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });

    renderStats(categoryCount, seenTitles.size);
    renderChart(categoryCount);

    document.getElementById('loading').style.display = 'none';
    document.getElementById('statsSummary').style.display = 'grid';
    document.getElementById('statsGrid').style.display = 'grid';
  })
  .catch(error => {
    console.error('Error fetching data:', error);
    document.getElementById('loading').innerHTML = `
          <div style="color: var(--orange-500); font-size: 48px; margin-bottom: 16px;">⚠️</div>
          <p>Failed to load project data. Please try refreshing the page.</p>
          <p style="font-size: 14px; color: var(--gray-500); margin-top: 8px;">Error: ${error.message}</p>
        `;
  });


function renderStats(categoryCount, totalUnique) {
  // Update main stats
  document.getElementById('totalProjects').textContent = totalUnique;
  document.getElementById('totalCategories').textContent = Object.keys(categoryCount).length;

  // Render category cards
  const grid = document.getElementById('statsGrid');
  grid.innerHTML = '';

  const sortedCategories = Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1]);

  const categoryIcons = {
    utility: 'ri-tools-line',
    game: 'ri-gamepad-line',
    puzzle: 'ri-puzzle-line',
    fun: 'ri-magic-line',
    communication: 'ri-chat-3-line',
    educational: 'ri-book-open-line',
    productivity: 'ri-task-line',
    creative: 'ri-palette-line',
    web: 'ri-global-line',
    mobile: 'ri-smartphone-line',
    desktop: 'ri-computer-line',
    ai: 'ri-cpu-line',
    data: 'ri-database-2-line',
    other: 'ri-folder-3-line'
  };

  sortedCategories.forEach(([cat, count], index) => {
    const icon = categoryIcons[cat] || 'ri-folder-3-line';
    const percentage = ((count / totalUnique) * 100).toFixed(1);

    grid.innerHTML += `
          <div class="stat-card">
            <h3><i class="${icon}"></i> ${capitalize(cat)}</h3>
            <span>${count}</span>
            <div class="percentage">
              <i class="ri-pie-chart-line"></i>
              ${percentage}% of total
            </div>
          </div>
        `;
  });
}

function renderChart(categoryCount) {
  const ctx = document.getElementById("categoryChart");

  // Orange gradient colors
  const orangeGradients = [
    'rgba(251, 146, 60, 0.9)',
    'rgba(249, 115, 22, 0.9)',
    'rgba(234, 88, 12, 0.9)',
    'rgba(194, 65, 12, 0.9)',
    'rgba(253, 186, 116, 0.9)',
    'rgba(245, 158, 11, 0.9)',
    'rgba(217, 119, 6, 0.9)'
  ];

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(categoryCount).map(capitalize),
      datasets: [{
        data: Object.values(categoryCount),
        backgroundColor: orangeGradients.slice(0, Object.keys(categoryCount).length),
        borderRadius: 12,
        borderWidth: 0,
        borderSkipped: false,
        barPercentage: 0.7,
        categoryPercentage: 0.8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: 'rgba(249, 115, 22, 0.3)',
          borderWidth: 1,
          cornerRadius: 8,
          padding: 12,
          callbacks: {
            label: function (context) {
              const value = context.raw;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return `${context.label}: ${value} projects (${percentage}%)`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(251, 146, 60, 0.1)',
            drawBorder: false
          },
          ticks: {
            stepSize: 1,
            color: 'var(--gray-600)',
            font: {
              weight: 500
            }
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: 'var(--gray-700)',
            font: {
              weight: 600,
              size: 13
            }
          }
        }
      },
      animation: {
        duration: 1000,
        easing: 'easeOutQuart'
      }
    }
  });
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}