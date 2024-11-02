const express = require("express");
const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.post("/api/process", async (req, res) => {
  const { url } = req.body;
  if (!url || !url.startsWith("http")) {
    return res.status(400).send("URL no proporcionada o no válida");
  }

  // Configuración de Chrome en modo headless para entornos de servidor
  const options = new chrome.Options();
  options.addArguments("--headless"); // Ejecuta Chrome sin interfaz gráfica
  options.addArguments("--no-sandbox"); // Evita problemas de permisos en entornos de servidor
  options.addArguments("--disable-dev-shm-usage"); // Usa /tmp en vez de /dev/shm
  options.addArguments("--disable-gpu"); // Desactiva la GPU (opcional)
  options.addArguments("--disable-software-rasterizer"); // Previene problemas en Render
  options.addArguments("--remote-debugging-port=9222"); // Puerto para depuración

  try {
    const driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();

    await driver.get(url);
    console.log("Página cargada exitosamente.");

    // Localiza y haz clic en el primer botón
    const firstButtonXpath =
      '//*[@id="content"]/div/div/div[1]/div[1]/div/div/div/div/div/div[2]/div/div[2]/div/div/div[1]/div[2]/button[1]';
    await driver.wait(until.elementLocated(By.xpath(firstButtonXpath)), 15000);
    const firstButton = await driver.findElement(By.xpath(firstButtonXpath));
    await firstButton.click();
    console.log("Primer botón clickeado exitosamente.");

    // Localiza y haz clic en el segundo botón
    await driver.sleep(3000);
    const secondButtonXpath =
      "/html/body/div[8]/div/div/div/footer/div[1]/div/div/div[2]/button";
    await driver.wait(until.elementLocated(By.xpath(secondButtonXpath)), 15000);
    const secondButton = await driver.findElement(By.xpath(secondButtonXpath));
    await secondButton.click();
    console.log("Segundo botón clickeado exitosamente.");

    // Mantener el navegador abierto para observación y responder al frontend
    await driver.sleep(5000); // Espera para observación
    res.json({ message: "Proceso completado sin errores." });
  } catch (error) {
    console.error("Error al procesar el enlace:", error); // Muestra el error en la consola
    res.status(500).send(`Error al procesar el enlace: ${error.message}`);
  }
});

app.listen(PORT, () => {
  console.log(`Backend funcionando en http://localhost:${PORT}`);
});
