module.exports = {
  files: {
    path: 'data' // by default, points to files-analysis-starter-kit/data folder
  },
  mongo: {
    url: 'mongodb://localhost:27017',
    db: 'files-analysis-starter-kit',
    drop: ['analysisResults'] // drop this collections before the analysis
  },
  computation: {
    maxCpus: 10 // Maximum number of cpus to use for multithreading
  }
}
