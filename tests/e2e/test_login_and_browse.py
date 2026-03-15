import time
import unittest

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions


BASE_URL = "http://localhost:5050"
ADMIN_EMAIL = "admin@bookstore.local"
ADMIN_PASSWORD = "Password123!"


class BookStoreLoginAndBrowseTest(unittest.TestCase):
    """
    Flujo E2E crítico (MVP):
    - Usuario admin accede al home.
    - Navega a la pantalla de login.
    - Se loguea con credenciales válidas.
    - Es redirigido al catálogo (/books) y visualiza la lista de libros.
    """

    def setUp(self):
        chrome_options = Options()
        # chrome_options.add_argument("--headless=new")
        self.driver = webdriver.Chrome(options=chrome_options)
        self.driver.maximize_window()
        self.wait = WebDriverWait(self.driver, 10)

    def tearDown(self):
        self.driver.quit()

    def test_admin_login_and_browse_catalog(self):
        driver = self.driver

        # accede al home/books
        driver.get(f"{BASE_URL}/books")

        # Verificar que cargó el título de la app
        self.wait.until(expected_conditions.title_contains("Book Store"))

        # clic en "Login"
        login_button = self.wait.until(expected_conditions.element_to_be_clickable((By.LINK_TEXT, "Login")))
        login_button.click()

        # ingresar credenciales
        email_input = self.wait.until(expected_conditions.visibility_of_element_located((By.ID, "email")))
        password_input = driver.find_element(By.ID, "password")

        # email
        email_input.clear()
        email_input.send_keys(ADMIN_EMAIL)

        # password
        password_input.clear()
        password_input.send_keys(ADMIN_PASSWORD)

        # click en Submit
        submit_button = driver.find_element(By.CSS_SELECTOR, "button.btn.btn-success")
        submit_button.click()

        # esperamos a que aparezca el nombre del usuario en el navbar (home.ejs)
        user_name = self.wait.until(expected_conditions.visibility_of_element_located((By.CSS_SELECTOR, ".user-name-home")))

        # checkear que user_name no esta vacio
        self.assertTrue(user_name.text.strip() != "")

        # validar que existen al menos un libro en el catálogo
        book_cards = driver.find_elements(By.CSS_SELECTOR, ".home-books .card")
        self.assertGreater(len(book_cards), 0, "Se esperaba al menos un libro en el catálogo")

if __name__ == "__main__":
    unittest.main()

