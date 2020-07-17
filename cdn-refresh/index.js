#!/usr/bin/env node
const program = require("commander");
const tencentcloud = require("tencentcloud-sdk-nodejs");
const _ = require("lodash");
const assert = require("assert");
//日志
const chalk = require("chalk");
const log = (...msg) => {
  console.log(...msg);
//   console.log(chalk("tencent-cdn-refresh-cli --> "), ...msg);
};
log.success = (...msg) => {
  log(chalk.green(...msg));
};
log.error = (...msg) => {
  log(chalk.red(...msg));
};
log.warn = (...msg) => {
  log(chalk.keyword("orange")(...msg));
};

//命令行参数
program
  .option("-i, --accessKeyId <accessKeyId>", "cos accessKeyId")
  .option("-k, --accessKeySecret <accessKeySecret>", "cos accessKeySecret")
  .option("-t, --type <type>", "dir | url(默认)", "url")
  .option("-p, --param <param>", "参数：type=dir 目录,type=url 资源");

program.parse(process.argv);

const {
  accessKeyId,
  accessKeySecret,
  type,
  param
} = program;

//参数校验
  assert.ok(
    accessKeyId,
    chalk.red("arg -i accessKeyId value error. < enter tencent-cdn-refresh-cli -h >")
  );
  assert.ok(
    accessKeySecret,
    chalk.red("arg -k accessKeySecret value error. < enter tencent-cdn-refresh-cli -h >")
  );
  assert.ok(
    type,
    chalk.red("arg -t source value error. < enter tencent-cdn-refresh-cli -h >")
  );
  assert.ok(
    param,
    chalk.red("arg -p param value error. < enter tencent-cdn-refresh-cli -h >")
  );
  log.success('即将刷新：',param);
//腾讯云配置
let _ossconfig = undefined;
const ossconfig = Object.assign(
    {
      accessKeyId: void 0,
      accessKeySecret: void 0,
      param: void 0
    },
    _ossconfig
  );
if (accessKeyId && accessKeySecret) {
    ossconfig.accessKeyId = accessKeyId;
    ossconfig.accessKeySecret = accessKeySecret;
    ossconfig.param = param;
  }

//为空校验

    if (
        _.some(
            _.pick(ossconfig, "accessKeyId", "accessKeySecret", "param"),
            val => typeof val === "undefined"
        )
    ) {
        throw new Error("invalid config");
    }

//腾讯云对象初始化

const CdnClient = tencentcloud.cdn.v20180606.Client;
const models = tencentcloud.cdn.v20180606.Models;

const Credential = tencentcloud.common.Credential;
const ClientProfile = tencentcloud.common.ClientProfile;
const HttpProfile = tencentcloud.common.HttpProfile;

let cred = new Credential(ossconfig.accessKeyId,ossconfig.accessKeySecret);
let httpProfile = new HttpProfile();
httpProfile.endpoint = "cdn.tencentcloudapi.com";
let clientProfile = new ClientProfile();
clientProfile.httpProfile = httpProfile;
let client = new CdnClient(cred, "ap-beijing", clientProfile);

//type类型判断，初始化不同的cdn对象

if (type === "url") {
    /**
     * URL
     */
    let req = new models.PurgeUrlsCacheRequest();
    let params = `{\"Urls\":[\"${ossconfig.param}\"]}`
    req.from_json_string(params);
    client.PurgeUrlsCache(req, function(errMsg, response) {
        if (errMsg) {
            log.error('fail msg :',errMsg);
            return;
        }
        log.success('success!');
        // log.success(response.to_json_string());
    });

} else if (type === "dir") {
    /**
     * 目录
     */
    let req = new models.PurgePathCacheRequest();

    let params = `{\"Paths\":[\"${ossconfig.param}\"],\"FlushType\":\"flush\"}`
    req.from_json_string(params);
    client.PurgePathCache(req, function(errMsg, response) {
        if (errMsg) {
            log.error('fail msg :',errMsg);
            return;
        }
        log.success('success!');
        // log.success(response.to_json_string());
    });
}else {
    log.warn("param is error");
}

