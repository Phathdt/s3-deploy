const path = require('path');
const exec = require('@actions/exec');
const core = require('@actions/core');

let deploy = function (params) {
  return new Promise((resolve, reject) => {
    const {
      folder,
      bucket,
      bucketRegion,
      distId,
      invalidation,
      deleteRemoved,
      noCache,
      private,
      cache,
      immutable,
      cacheControl,
      filesToInclude,
    } = params;

    const distIdArg = distId ? `--distId ${distId}` : '';
    const invalidationArg = distId ? `--invalidate "${invalidation}"` : '';
    const deleteRemovedArg =
      deleteRemoved && !/false/i.test(deleteRemoved)
        ? /true/i.test(deleteRemoved)
          ? `--deleteRemoved`
          : `--deleteRemoved ${deleteRemoved}`
        : '';
    const noCacheArg = noCache ? '--noCache' : '';
    const immutableArg = immutable ? '--immutable' : '';
    const cacheControlArg = cacheControl ? `--cacheControl ${cacheControl}` : '';
    const privateArg = private ? '--private' : '';
    const cacheFlag = cache ? `--cache ${cache}` : '';
    const filesRegex = filesToInclude ? filesToInclude : '**';

    core.debug(">>>>>>>>>>>>>>>>>>>>>>")
    core.debug("cacheControl", cacheControl)
    core.debug("cacheControlArg", cacheControlArg)
    core.debug(">>>>>>>>>>>>>>>>>>>>>>")

    try {
      const command = `npx s3-deploy@1.4.0 ./${filesRegex} \
                        --bucket ${bucket} \
                        --region ${bucketRegion} \
                        --cwd ./ \
                        ${distIdArg} \
                        --etag \
                        --gzip xml,html,htm,js,css,ttf,otf,svg,txt \
                        ${cacheFlag} \
                        ${invalidationArg} \
                        ${deleteRemovedArg} \
                        ${noCacheArg} \
                        ${immutableArg} \
                        ${cacheControlArg} \
                        ${privateArg} `;

      const cwd = path.resolve(folder);
      exec.exec(command, [], { cwd }).then(resolve).catch(reject);
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = deploy;
