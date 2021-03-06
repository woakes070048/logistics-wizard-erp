// Licensed under the Apache License. See footer for details.
var winston = require("winston");

// default to in-memory datasource
var datasources = {
  "db": {
    "name": "db",
    "connector": "memory-idstr"
  }
};

// then use VCAP_SERVICES
if (process.env.VCAP_SERVICES) {
  var vcapServices = JSON.parse(process.env.VCAP_SERVICES);
  if (vcapServices.hasOwnProperty("cloudantNoSQLDB")) {
    winston.info("Using Cloudant as datasource");
    datasources.db = {
      connector: "cloudant",
      url: vcapServices.cloudantNoSQLDB[0].credentials.url,
      database: "erp-service"
    };
  }
}

// and allow override with a local datasource definition
var localDatasources = null;
try {
  localDatasources = require("./datasources.local.json");
  winston.info("Loaded local datasources");

  if (localDatasources.hasOwnProperty("db")) {
    winston.info("Using locally defined datasource");
    datasources.db = localDatasources.db;
  }
} catch (e) {
  winston.error(e);
}

winston.info("Datasources are", datasources);
module.exports = datasources;

//------------------------------------------------------------------------------
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//------------------------------------------------------------------------------
