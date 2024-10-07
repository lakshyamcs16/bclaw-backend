import app from "./server";

// Get port information from the config
const port = app.get("port");
const host = app.get("host");

// Serve the app on 0.0.0.0 to listen on all available network interfaces
const server = app.listen(port, host, () =>
  console.log(`Server started on port ${port}`)
);

export default server;