let express = require("express"),
  jobController = require("../controllers/jobs");
let router = express.Router();
// model
let Job = require("../models/job-DB.js"),
  Notification = require("../models/notif-DB");
// middlewares, destructuring
let { isLoggedIn, isAdmin } = require("../middlewares/index");

router.get("/", jobController.jobIndex);
// index
router.get("/jobs", jobController.jobIndex);
// new
router.get("/jobs/new", isLoggedIn, isAdmin, jobController.newJobForm);
// create
router.post("/jobs", isLoggedIn, isAdmin, jobController.createJob);
// show
router.get("/jobs/:id", jobController.showJob);
// edit
router.get("/jobs/:id/edit", isLoggedIn, isAdmin, jobController.editJobForm);
// update
router.patch("/jobs/:id", isLoggedIn, isAdmin, jobController.updateJob);
// delete
router.delete("/jobs/:id", isLoggedIn, isAdmin, jobController.deleteJob);
// apply in jobs
router.get("/jobs/:jobId/apply", isLoggedIn, jobController.applyJob);

router.get("/temp", async (req, res) => {
  for (let i = 0; i < 50; i++) {
    try {
      let name = "Google";
      let address = "Delhi";
      let image =
        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/706px-Google_%22G%22_Logo.svg.png";
      let package = 6000;
      let cgpa = 9.1;
      let deadline = Date.now();
      let type = "SDE1";

      // make a database object / model instance
      let newJob = new Job({
        name: name,
        address: address,
        image: image,
        package: package,
        cgpa: cgpa,
        deadline: deadline,
        type: type,
      });
      await newJob.save();
      //! push a new notificatoin
      let newNotif = new Notification({
        body: "A new job has been posted",
        author: newJob.name,
      });
      await newNotif.save();
      req.flash("success", "job successfully posted");
      res.redirect("/jobs");
    } catch (error) {
      console.log("error while adding a new job", error);
    }
  }
});

module.exports = router;
