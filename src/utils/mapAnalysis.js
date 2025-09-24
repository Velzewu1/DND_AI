// Функции для анализа сгенерированной карты и создания описания

export const analyzeMap = (map) => {
  if (!map || !map.length) return null;

  const stats = {
    water: 0,
    coast: 0,
    land: 0,
    mountain: 0,
    peak: 0,
    special: 0,
    total: 0
  };

  const features = [];
  const mapWidth = map[0].length;
  const mapHeight = map.length;

  // Подсчитываем статистику
  map.flat().forEach(cell => {
    stats[cell.type]++;
    stats.total++;
  });

  // Вычисляем проценты
  const percentages = {};
  Object.keys(stats).forEach(key => {
    if (key !== 'total') {
      percentages[key] = Math.round((stats[key] / stats.total) * 100);
    }
  });

  // Определяем особенности карты
  if (percentages.water > 60) features.push('ocean-dominated');
  if (percentages.land > 50) features.push('land-rich');
  if (percentages.mountain > 20) features.push('mountainous');
  if (percentages.peak > 5) features.push('high peaks');
  if (percentages.coast > 15) features.push('extensive coastlines');
  if (percentages.special > 2) features.push('magical anomalies');

  return {
    stats,
    percentages,
    features,
    dimensions: { width: mapWidth, height: mapHeight }
  };
};

export const generateMapDescription = (map, config) => {
  const analysis = analyzeMap(map);
  if (!analysis) return '';

  const { percentages, features, dimensions } = analysis;
  
  let description = `A ${config.terrainType} map (${dimensions.width}x${dimensions.height}) with `;
  
  // Описываем состав
  const terrainParts = [];
  if (percentages.water > 0) terrainParts.push(`${percentages.water}% water`);
  if (percentages.land > 0) terrainParts.push(`${percentages.land}% land`);
  if (percentages.mountain > 0) terrainParts.push(`${percentages.mountain}% mountains`);
  if (percentages.peak > 0) terrainParts.push(`${percentages.peak}% peaks`);
  if (percentages.special > 0) terrainParts.push(`${percentages.special}% special`);
  
  description += terrainParts.join(', ') + '. ';
  
  // Добавляем особенности
  if (features.length > 0) {
    description += `Features: ${features.join(', ')}. `;
  }
  
  // Добавляем стиль
  description += `Style: ${config.style} with ${config.genre} atmosphere. `;
  
  // Добавляем детали для разных типов карт
  switch (config.terrainType) {
    case 'archipelago':
      description += 'Multiple islands scattered across the sea with varied sizes and shapes. ';
      break;
    case 'continent':
      description += 'Single large landmass with diverse terrain and natural borders. ';
      break;
    case '2 continents':
      description += 'Two separate landmasses with distinct geographical features. ';
      break;
  }
  
  return description.trim();
};

export const generateASCIIMap = (map) => {
  if (!map || !map.length) return '';
  
  return map.map(row => 
    row.map(cell => {
      switch (cell.type) {
        case 'water': return '~';
        case 'coast': return '≈';
        case 'land': return '█';
        case 'mountain': return '▲';
        case 'peak': return '▲';
        case 'special': return '★';
        default: return '·';
      }
    }).join('')
  ).join('\n');
};
