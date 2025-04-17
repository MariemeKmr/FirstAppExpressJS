const courses = [
    {
      title: "Introduction à l'IA",
      description: "Découvrez les fondamentaux de l'intelligence artificielle.",
      price: 199,
      level: "Débutant"
    },
    {
      title: "Machine Learning Fondamental",
      description: "Apprenez les principes du machine learning et les algorithmes de base.",
      price: 299,
      level: "Intermédiaire"
    },
    {
      title: "Deep Learning Avancé",
      description: "Maîtrisez les réseaux de neurones profonds et leurs applications.",
      price: 399,
      level: "Avancé"
    }
  ];
  
  exports.index = (req, res) => {
    res.render("index", { pageTitle: "Accueil" });
  };
  
  exports.about = (req, res) => {
    res.render("about", { pageTitle: "À propos" });
  };
  
  exports.courses = (req, res) => {
    const allCourses = [
      { title: "Intro IA", level: "Débutant", price: 100 },
      { title: "Machine Learning", level: "Intermédiaire", price: 200 },
      { title: "Deep Learning", level: "Avancé", price: 300 }
    ];
  
    const { level, maxPrice } = req.query;
  
    let filtered = allCourses;
  
    if (level) {
      filtered = filtered.filter(c => c.level.toLowerCase() === level.toLowerCase());
    }
  
    if (maxPrice) {
      filtered = filtered.filter(c => c.price <= parseInt(maxPrice));
    }
  
    res.render("courses", {
      pageTitle: "Nos cours",
      courses: filtered,
      selectedLevel: level || "",
      selectedPrice: maxPrice || ""
    });
  };
  
  
  exports.contact = (req, res) => {
    res.render("contact", { pageTitle: "Contact" });
  };

  exports.processContact = (req, res) => {
    const { name, email, course, message } = req.body;
  
    const errors = [];
  
    if (!name || !email || !course || !message) {
      errors.push("Tous les champs doivent être remplis.");
    }
  
    if (email && !email.includes("@")) {
      errors.push("Adresse email invalide.");
    }
  
    if (errors.length > 0) {
      req.session.flash = {
        type: "error",
        message: errors.join(" ")
      };
      return res.redirect("/contact");
    }
  
    console.log("Message reçu :", req.body);
  
    req.session.flash = {
      type: "success",
      message: "Votre message a bien été envoyé !"
    };
    res.redirect("/contact");
  };
  

  exports.faq = (req, res) => {
    res.render("faq", { pageTitle: "FAQ" });
  };
  