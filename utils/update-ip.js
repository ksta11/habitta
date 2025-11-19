const fs = require("fs");
const os = require("os");
const path = require("path");

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return null;
}

function updateEnvFile() {
  const ip = getLocalIP();
  if (!ip) {
    console.error("❌ No se pudo obtener la IP local.");
    return;
  }

  const envPath = path.join(__dirname, "..", ".env");
  let envContent = fs.readFileSync(envPath, "utf8");

  const newApiUrl = `EXPO_PUBLIC_API_BASE_URL=http://${ip}:3000`;

  envContent = envContent.replace(
    /^EXPO_PUBLIC_API_BASE_URL=.*$/m,
    newApiUrl
  );

  fs.writeFileSync(envPath, envContent);
  console.log(`✅ IP actualizada en .env: ${newApiUrl}`);
}

updateEnvFile();
