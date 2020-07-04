const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "jaysing989@gmail.com",
    subject: "Welcome to the task-app. Hope you enjoy your stay!",
    text: `Thanks for signing up, ${name}! You've now access to a basic task app`,
  });
};

const sendSayonaraEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "jaysing989@gmail.com",
    subject: "It's hard to see you go.",
    text: `Hi ${name}, 
        It's sad to see you leave our platform. If you have a moment to spare, it'd be great if you could let us know what made you leave our service, because we're a small startup and we'd love to have some inputs, especially from our unsatisfied customers.`,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendSayonaraEmail,
};
