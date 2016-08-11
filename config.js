module.exports = {
  files: {
    path: 'data' // points to files-analysis-starter-kit/data folder
  },
  mongo: {
    url: 'mongodb://localhost:27017',
    db: 'files-analysis-starter-kit',
    drop: ['analysisResults']
  }
}
