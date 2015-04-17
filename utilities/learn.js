/**
 * Although not used by the deployed web server, this file can be run
 * independently to train a new SVM and persist the predictor into a
 * local JSON file.
 */
var svm = require('node-svm');
var fs = require('fs');

var finished = false;

// This data is used to train the SVM
var data = JSON.parse(fs.readFileSync('../alldata.txt'));

// This data is ideally independent of the training data and is
// used as an initial judge of the accuracy of the newly trained SVM
var testData = JSON.parse(fs.readFileSync('../data.test.txt'));

trainSvm();

/**
 * Trains a new SVM with the training data loaded above
 */
function trainSvm() {
    predictor = new svm.CSVC();

    console.log("Beginning training for c=%d, gamma=%d...", c, gamma);
    predictor.train(data)
        .progress(function (progress) {
            console.log('training progress: %d%', Math.round(progress * 100));
        })
        .spread(function (model, report) {
            fs.writeFileSync("../model.json", JSON.stringify(model));
            console.log('SVM trained.\nReport:\n%s', JSON.stringify(report));
        })
        .done(function () {
            console.log("All done");
            console.log(JSON.stringify(predictor.evaluate(testData)));
            console.log(JSON.stringify(predictor.evaluate(data)));
            finished = true;
        });

}