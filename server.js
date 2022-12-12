//require the app
var app = require('./app');
const connectDB = require('./db/connect');

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(process.env.PORT, () =>
      console.log(`App listening at :${process.env.PORT}`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
