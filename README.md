# Files analysis starter kit

Project for analysing large amount of files with NodeJs (& MongoDb).

![Screen capture](docs/screencapture.jpg)

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
  mime: 'application/pdf',
  stats: {
    dev: 16777220,
    mode: 33188,
    nlink: 1,
    uid: 501, // user-id of the owner of the file.
    gid: 20, // group-id of the owner of the file.
    rdev: 0,
    blksize: 4096,
    ino: 29670994,
    size: 68704, // Size in bytes
    blocks: 136,
    atime: Thu Aug 11 2016 13:30:51 GMT+0200 (CEST), // last access
    mtime: Tue Apr 01 2008 08:52:56 GMT+0200 (CEST), // last modification
    ctime: Tue Aug 09 2016 04:20:35 GMT+0200 (CEST), // creation
    birthtime: Tue Apr 01 2008 08:52:56 GMT+0200 (CEST)
  }
}
```

To use the MongoDb connection use ```dbs.mongo```. i.e.:

```
dbs.mongo.getCollection('myCollection').insert(...)
```
