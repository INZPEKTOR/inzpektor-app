const getDashboard = (req, res) => {
  const userData = {
    username: "emmilili.xlm",
    points: 100,
    digitalProofs: [
      {
        title: "Email",
        subtitle: "Verify with your email address",
        status: "verify",
        points: 30,
        icon: "identity"
      },
      {
        title: "Facebook",
        subtitle: "Verify your Facebook account",
        status: "verify",
        points: 30,
        icon: "facebook"
      },
    ],
    physicalProofs: [
      {
        title: "Government ID",
        subtitle: "Verify using your Government-issued ID.",
        points: 30,
        icon: "government"
      },
      {
        title: "Biometrics",
        subtitle: "Liveness and uniqueness verification.",
        points: 30,
        icon: "biometrics"
      },
      {
        title: "Phone Verification",
        subtitle: "Verify with your phone number.",
        points: 30,
        icon: "phone"
      },
    ],
    inspektorScore: {
      status: "PROOF OF CLEAN HANDS VERIFIED",
      version: "v1.0",
      mintedDate: "2025.11.21"
    }
  };

  res.render('dashboard', { userData });
};

module.exports = {
  getDashboard
};

