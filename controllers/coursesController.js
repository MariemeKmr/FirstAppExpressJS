const Course = require("../models/Course"); 
const mongoose = require('mongoose');

// Fonction utilitaire pour extraire les paramètres du cours du corps de la requête 
const getCourseParams = body => { 
  return { 
    title: body.title, 
    description: body.description, 
    maxStudents: body.maxStudents, 
    cost: body.cost 
  }; 
}; 
 
module.exports = { 
  index: (req, res, next) => { 
    Course.find({}) 
      .then(courses => { 
        res.locals.courses = courses; 
        next(); 
      }) 
      .catch(error => { 
        console.log(`Erreur lors de la récupération des cours: ${error.message}`); 
        next(error); 
      }); 
  }, 
   
  indexView: (req, res) => { 
    res.render("courses/index"); 
  }, 
   
  new: (req, res) => { 
    res.render("courses/new"); 
  }, 
   
  create: (req, res, next) => { 
    let courseParams = getCourseParams(req.body); 
    Course.create(courseParams) 
      .then(course => { 
        res.locals.redirect = "/courses/index"; 
        res.locals.course = course; 
        next(); 
      }) 
      .catch(error => { 
        console.log(`Erreur lors de la création du cours: ${error.message}`); 
        res.locals.redirect = "/courses/new"; 
        next(); 
      }); 
  }, 
   
  redirectView: (req, res, next) => { 
    let redirectPath = res.locals.redirect; 
    if (redirectPath) res.redirect(redirectPath); 
    else next(); 
  }, 
   
  show: (req, res, next) => {
    let courseId = req.params.id;
  
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return next(); // redirige vers l'erreur 404
    }
  
    Course.findById(courseId)
      .populate("students")
      .then(course => {
        res.locals.course = course;
        next();
      })
      .catch(error => {
        console.log(`Erreur lors de la récupération du cours par ID: ${error.message}`);
        next(error);
      });
  },
   
   
  showView: (req, res) => { 
    res.render("courses/show"); 
  }, 
   
  edit: (req, res, next) => { 
    let courseId = req.params.id; 
    Course.findById(courseId) 
      .then(course => { 
        res.render("courses/edit", { 
          course: course 
        }); 
      }) 
      .catch(error => { 
        console.log(`Erreur lors de la récupération du cours par ID: ${error.message}`); 
        next(error); 
      }); 
  }, 
   
  update: (req, res, next) => { 
    let courseId = req.params.id, 
      courseParams = getCourseParams(req.body); 
     
    Course.findByIdAndUpdate(courseId, { 
      $set: courseParams 
    }) 
      .then(course => { 
        res.locals.redirect = `/courses/${courseId}`; 
        res.locals.course = course; 
        next(); 
      }) 
      .catch(error => { 
        console.log(`Erreur lors de la mise à jour du cours par ID: ${error.message}`); 
        next(error); 
      }); 
  }, 
   
  delete: (req, res, next) => { 
    let courseId = req.params.id; 
    Course.findByIdAndDelete(courseId) 
      .then(() => { 
        res.locals.redirect = "/courses/index"; 
        next(); 
      }) 
      .catch(error => { 
        console.log(`Erreur lors de la suppression du cours par ID: ${error.message}`); 
        next(); 
      }); 
  },  
  
  enroll: (req, res, next) => {
    const courseId = req.params.id;
    const userId = req.user._id; // Assurez-vous que l'utilisateur est authentifié

    Course.findById(courseId)
      .then(course => {
        if (!course) {
          req.flash('error', 'Cours non trouvé.');
          return res.redirect('/courses');
        }

        // Vérifier si l'utilisateur est déjà inscrit
        if (course.students.includes(userId)) {
          req.flash('info', 'Vous êtes déjà inscrit à ce cours.');
          return res.redirect(`/courses/${courseId}`);
        }

        // Ajouter l'utilisateur à la liste des étudiants
        course.students.push(userId);
        return course.save();
      })
      .then(() => {
        req.flash('success', 'Inscription réussie au cours.');
        res.redirect(`/courses/${courseId}`);
      })
      .catch(error => {
        console.error(`Erreur lors de l'inscription : ${error.message}`);
        next(error);
      });
  }
}; 
 
