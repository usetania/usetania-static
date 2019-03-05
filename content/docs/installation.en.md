---
title: "Installation"
date: 2019-02-04T19:34:29+08:00
draft: false
type: "docs"
layout: "docs"
---

This software is built with [Go](https://golang.org) programming language. It means you will get an executable binary to run on your machine. You **don't need** extra software like MAMP, XAMPP, or WAMP to run **Tania**, but you may need MySQL database if you choose to use it instead of SQLite *(the default database.)*

The easiest way to install Tania is using pre-built binaries for Windows (x64) and Linux (x64). You can download it from [the release page](https://github.com/Tanibox/tania-core/releases/tag/1.5.1). After the download process is finished, you can unzip it, and run it from Windows Command Prompt/Powershell by using `.\tania-core.exe` or from Linux terminal by using `./tania-core`.

If your OS is neither Windows (x64) nor Linux (x64), then you must build Tania by yourself. You can follow this instruction below.

### Prerequisites
- [Go](https://golang.org) 1.11.x 
- [NodeJS](https://nodejs.org/en/) 8 or 10

### Building Instructions

Assume that your Go environment is in `~/go`.

1. Make sure you have installed `golang/dep` 
    - https://golang.github.io/dep/docs/installation.html
    - https://gist.github.com/subfuzion/12342599e26f5094e4e2d08e9d4ad50d
2. Clone the repo using `go get github.com/Tanibox/tania-core`
3. Checkout the stable version by using `cd ~/go/src/github.com/Tanibox/tania-core && git checkout tags/1.5.1 -b v1.5.1`
4. From the project root, call `dep ensure` to install the Go dependencies
    - If you have an issue with `dep ensure`, you can call `go get` instead.
5. Create a new file `conf.json` using the values from the `conf.json.example` and set it with your own values.
6. Issue `npm install` to install VueJS dependencies.
7. To build the VueJS, just run `npm run dev` for development purpose or `npm run prod` for production purpose.
8. Setup SQLite:
    - Edit `SqlitePath` in `conf.json` to your sqlite DB file path (ex: /Users/user/Programs/sqlite/tania.db)
    - Create an empty file with the exact filename and path that match the `SqlitePath` config.
9. Compile the source code with `go build`. It will produces `tania-core.exe` (on Windows) or `tania-core` (on Linux and OSX.)
10. Run the program from Terminal by issuing `./tania-core`, or from Windows Command Prompt by issuing `.\tania-core.exe`. 
11. The default username and password are `tania / tania`.

### Database Engine

Tania uses SQLite as the default database engine. You may use MySQL as your database engine by replacing `sqlite` with `mysql` at `tania_persistence_engine` field in your `conf.json`.

```
{
  "tania_persistence_engine": "sqlite",
  "demo_mode": true,
  "upload_path_area": "uploads/areas",
  "upload_path_crop": "uploads/crops",
  "sqlite_path": "db/sqlite/tania.db",
  "mysql_host": "127.0.0.1",
  "mysql_port": "3306",
  "mysql_dbname": "tania",
  "mysql_user": "root",
  "mysql_password": "root",
  "redirect_uri": "http://localhost:8080/",
  "client_id": "f0ece679-3f53-463e-b624-73e83049d6ac"
}
```

### Run The Test
- Use `go test ./...` to run all the Go tests.
- Use `npm run cypress:run` to run the end-to-end test