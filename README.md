# Files analysis starter kit

Project for analysing large amount of files with NodeJs (& MongoDb).

## How to start

1. Edit ```config.js``` to set the path for the files to analyse and your MongoDb settings.
2. Edit ```libs/analysis.js``` with your actual analysis code.
3. Execute with ```node main.js```

## The work

The actual analysis code must be placed within ```libs/analysis.js``` work's function.

The fileInfo parameter have the following structure:

```
{
  root: '/',
  dir: '/.../files-analysis-starter-kit/data/subfolder',
  base: 'myPdfFile.PDF',
  ext: '.PDF',
  name: 'myPdfFile',
  route: '/.../files-analysis-starter-kit/data/subfolder/myPdfFile.PDF',
  mime: 'application/pdf'
}
```

To use the MongoDb connection use ```dbs.mongo```. i.e.:

```
dbs.mongo.getCollection('myCollection').insert(...)
```
