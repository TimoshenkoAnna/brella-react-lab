# Лабораторная работа №7: Пункт обмена валюты (PERN Stack)

Этот проект представляет собой веб-приложение с многоуровневой архитектурой на основе стека **PERN (PostgreSQL, Express, React, Node.js)**. Он реализует функционал пункта обмена валюты, демонстрируя проектирование базы данных, создание REST API и клиентского приложения.

## Предметная область: Пункт обмена валюты

### Проектирование базы данных (PostgreSQL)

База данных состоит из 3 таблиц: `currencies`, `rates`, `transactions`.

1.  **`Currencies` (Валюты)**
    *   `id`: INTEGER (PRIMARY KEY, AUTOINCREMENT)
    *   `code`: STRING (UNIQUE, NOT NULL) - ISO код валюты (например, "USD", "EUR")
    *   `name`: STRING (NOT NULL) - Полное название валюты
    *   `photo`: STRING (NOT NULL) - URL изображения флага

2.  **`Rates` (Курсы обмена)**
    *   `id`: INTEGER (PRIMARY KEY, AUTOINCREMENT)
    *   `fromCurrencyId`: INTEGER (FOREIGN KEY -> `Currencies.id`, NOT NULL) - ID исходной валюты
    *   `toCurrencyId`: INTEGER (FOREIGN KEY -> `Currencies.id`, NOT NULL) - ID целевой валюты
    *   `rate`: FLOAT (NOT NULL) - Курс обмена (например, 3.25)
    *   **Связи:** `Rate` относится к `Currency` (дважды: `fromCurrency` и `toCurrency`).

3.  **`Transactions` (Транзакции)**
    *   `id`: INTEGER (PRIMARY KEY, AUTOINCREMENT)
    *   `rateId`: INTEGER (FOREIGN KEY -> `Rates.id`, NOT NULL) - ID использованного курса обмена
    *   `amountFrom`: FLOAT (NOT NULL) - Сумма исходной валюты
    *   `amountTo`: DECIMAL(10, 2) (NOT NULL) - Сумма целевой валюты
    *   **Связи:** `Transaction` относится к `Rate`.

### Заполнение базы данных

База данных заполняется тестовыми данными (более 50 записей) с помощью скрипта `server/seed.js`.

## Серверная часть (Backend: Node.js, Express, PostgreSQL, Sequelize)

Сервер реализован на Express.js и взаимодействует с PostgreSQL через ORM Sequelize.

### Структура папок сервера:

*   `server/server.js`: Главный файл сервера.
*   `server/db/index.js`: Настройка подключения к PostgreSQL.
*   `server/db/models/`: Определение моделей Sequelize.
    *   `Currency.js`, `Rate.js`, `Transaction.js`, `models.js` (связи).
*   `server/controllers/`: Логика обработки запросов для каждой сущности.
    *   `CurrencyController.js`, `RateController.js`, `TransactionController.js`.
*   `server/routes/`: Определение API-эндпоинтов.
    *   `currencyRouter.js`, `rateRouter.js`, `transactionRouter.js`, `index.js` (главный роутер).
*   `server/middleware/ErrorHandlerMiddleware.js`: Централизованный обработчик ошибок.
*   `server/error/ApiError.js`: Кастомный класс ошибок API.
*   `server/.env`: Переменные окружения для подключения к БД (не попадает в Git).

### REST API (эндпоинты)

Базовый URL API: `http://localhost:5000/api`

#### 1. Сущность `Currency` (Валюты) - `/api/currency`

*   **`POST /`**
    *   **Описание:** Создание новой валюты.
    *   **Параметры тела:** `code`, `name`, `photo`.
    *   **Валидация:** Все поля обязательны, `code` должен быть уникальным.
*   **`GET /`**
    *   **Описание:** Получение списка валют.
    *   **Параметры запроса (Query params):** `limit`, `page`, `sortBy`, `sortOrder`, `filterCode`, `searchName`.
*   **`GET /:id`**
    *   **Описание:** Получение детальной информации о валюте по ID.
    *   **Параметры URL:** `id`.
*   **`PUT /:id`**
    *   **Описание:** Обновление валюты по ID.
    *   **Параметры URL:** `id`. **Параметры тела:** `code`, `name`, `photo` (частично или полностью).
*   **`DELETE /:id`**
    *   **Описание:** Удаление валюты по ID.
    *   **Параметры URL:** `id`.
*   **`GET /:id/exists`**
    *   **Описание:** Проверка существования валюты по ID.
    *   **Параметры URL:** `id`.

#### 2. Сущность `Rate` (Курсы обмена) - `/api/rate`

*   **`POST /`**
    *   **Описание:** Создание нового курса.
    *   **Параметры тела:** `fromCurrencyId`, `toCurrencyId`, `rate`.
    *   **Валидация:** Все поля обязательны, `rate` - число. Проверяется существование `fromCurrencyId` и `toCurrencyId`. Курс для данной пары валют должен быть уникальным.
*   **`GET /`**
    *   **Описание:** Получение списка курсов с информацией о валютах.
    *   **Параметры запроса:** `limit`, `page`, `sortBy`, `sortOrder`, `filterFrom`, `filterTo`.
*   **`GET /:id`**
    *   **Описание:** Получение детальной информации о курсе по ID.
    *   **Параметры URL:** `id`.
*   **`PUT /:id`**
    *   **Описание:** Обновление курса по ID.
    *   **Параметры URL:** `id`. **Параметры тела:** `fromCurrencyId`, `toCurrencyId`, `rate`. Проверяется существование валют, если они меняются.
*   **`DELETE /:id`**
    *   **Описание:** Удаление курса по ID.
    *   **Параметры URL:** `id`.

#### 3. Сущность `Transaction` (Транзакции) - `/api/transaction`

*   **`POST /`**
    *   **Описание:** Создание новой транзакции.
    *   **Параметры тела:** `rateId`, `amountFrom`, `amountTo`.
    *   **Валидация:** Все поля обязательны, `amountFrom`, `amountTo` - числа. Проверяется существование `rateId`.
*   **`GET /`**
    *   **Описание:** Получение списка транзакций с полной информацией о курсах и валютах.
    *   **Параметры запроса:** `limit`, `page`, `sortBy`, `sortOrder`, `filterRateId`, `searchAmountFrom`.
*   **`GET /:id`**
    *   **Описание:** Получение детальной информации о транзакции по ID.
    *   **Параметры URL:** `id`.
*   **`PUT /:id`**
    *   **Описание:** Обновление транзакции по ID.
    *   **Параметры URL:** `id`. **Параметры тела:** `rateId`, `amountFrom`, `amountTo`. Проверяется существование `rateId`, если оно меняется.
*   **`DELETE /:id`**
    *   **Описание:** Удаление транзакции по ID.
    *   **Параметры URL:** `id`.

### Валидация данных на уровне моделей (Sequelize)

*   Все поля, помеченные как `allowNull: false`, имеют встроенную валидацию на обязательность.
*   `Currency.code`: `unique: true` обеспечивает уникальность кодов валют.
*   `Rate.rate`: `isNaN` проверка в контроллере обеспечивает числовой формат.
*   Проверки на существование связанных сущностей (`Currency.findByPk`, `Rate.findByPk`) реализуют пользовательскую логику валидации на уровне контроллеров.

### Тестирование всех эндпоинтов с использованием Postman:
*   (См. раздел "Тестовые сценарии для Postman" ниже).

---

## Клиентская часть (Frontend: React, Redux, Axios, React Bootstrap)

Клиентское приложение React взаимодействует с бэкендом через HTTP-запросы с помощью **Axios**.

1.  **Адаптивный интерфейс:**
    *   Реализован с помощью React Bootstrap, его сетки (`Container`, `Row`, `Col`) и адаптивных компонентов (`Navbar`, `Table`).

2.  **State Management (Redux):**
    *   Хранилище Redux (`client/src/redux/store.js`) управляется с помощью Redux Toolkit.
    *   Для каждой сущности (`Currency`, `Rate`, `Transaction`) создан отдельный слайс (`currencySlice.js`, `rateSlice.js`, `transactionSlice.js`), который содержит асинхронные thunk-экшены для взаимодействия с API (Axios).

3.  **Роутинг между страницами:**
    *   Реализован с помощью React Router (`client/src/App.js`) для навигации между страницами валют, курсов и транзакций.

4.  **Формы со списком всех записей:**
    *   Для `Currencies` реализована страница `client/src/pages/CurrencyPage.js`, где отображается таблица со списком валют.
    *   (Для `Rates` и `Transactions` страницы-заглушки, которые будут содержать формы и списки после реализации).

5.  **Редактирование и добавление записей в формах:**
    *   На `CurrencyPage.js` реализовано модальное окно с формой (используется `Formik` и `Yup` для клиентской валидации) для создания и редактирования валют.

6.  **Подтверждение при удалении записи:**
    *   Функция `handleDelete` на `CurrencyPage.js` использует `window.confirm()` для получения подтверждения перед отправкой DELETE-запроса.

7.  **Уведомления при невозможности удаления:**
    *   При неудачном удалении (например, если бэкенд вернет ошибку), на `CurrencyPage.js` отображается `Alert` с сообщением об ошибке.

8.  **Валидация форм на стороне клиента:**
    *   На `CurrencyPage.js` используется библиотека `Yup` для определения схемы валидации (`currencySchema`) и `Formik` для интеграции этой валидации с формой.

9.  **Подробные сведения о выбранном объекте, включая фото:**
    *   На `CurrencyPage.js` в таблице рядом с названием валюты отображается ее флаг (фото) из данных.

10. **Использование Axios для HTTP-запросов:**
    *   Все асинхронные thunk-экшены в Redux-слайсах (`currencySlice.js`, `rateSlice.js`, `transactionSlice.js`) используют библиотеку `Axios` для отправки HTTP-запросов к бэкенду.

---

## Тестовые сценарии для Postman

Все запросы выполняются к `http://localhost:5000/api`.

### 1. Сущность `Currency` (Валюты) - `/currency`

**(Запустите `node server.js` перед тестированием)**

*   **POST /currency** (Создать валюту)
    *   **Body (raw, JSON):** `{"code": "TEST", "name": "Тестовая Валюта", "photo": "https://flags/test.png"}`
    *   **Ожидаемый статус:** `200 OK`. **Ожидаемый ответ:** JSON с `id` и всеми полями.
    *   **Некорректный POST /currency** (нет `code`)
    *   **Body (raw, JSON):** `{"name": "Тестовая Валюта", "photo": "https://flags/test.png"}`
    *   **Ожидаемый статус:** `400 Bad Request`. **Ожидаемый ответ:** `{"message": "Все поля (code, name, photo) обязательны."}`
    *   **Некорректный POST /currency** (существующий `code`)
    *   **Body (raw, JSON):** `{"code": "TEST", "name": "Дубликат", "photo": "https://flags/dup.png"}`
    *   **Ожидаемый статус:** `409 Conflict`. **Ожидаемый ответ:** `{"message": "Ошибка: Валюта с таким кодом уже существует."}`

*   **GET /currency** (Получить все валюты)
    *   **Запрос:** `GET http://localhost:5000/api/currency`
    *   **Ожидаемый статус:** `200 OK`. **Ожидаемый ответ:** JSON `{ "count": N, "rows": [...] }` (массив созданных валют).

*   **GET /currency?limit=1&page=1** (Пагинация)
    *   **Запрос:** `GET http://localhost:5000/api/currency?limit=1&page=1`
    *   **Ожидаемый статус:** `200 OK`. **Ожидаемый ответ:** JSON `{ "count": N, "rows": [...] }` (1 валюта на 1 странице).

*   **GET /currency?sortBy=code&sortOrder=DESC** (Сортировка)
    *   **Запрос:** `GET http://localhost:5000/api/currency?sortBy=code&sortOrder=DESC`
    *   **Ожидаемый статус:** `200 OK`. **Ожидаемый ответ:** Валюты отсортированы по коду в убывающем порядке.

*   **GET /currency?filterCode=USD** (Фильтрация)
    *   **Запрос:** `GET http://localhost:5000/api/currency?filterCode=USD`
    *   **Ожидаемый статус:** `200 OK`. **Ожидаемый ответ:** Только валюты с `code: "USD"`.

*   **GET /currency?searchName=Доллар** (Поиск)
    *   **Запрос:** `GET http://localhost:5000/api/currency?searchName=Доллар`
    *   **Ожидаемый статус:** `200 OK`. **Ожидаемый ответ:** Валюты, содержащие "Доллар" в названии.

*   **GET /currency/:id** (Получить валюту по ID)
    *   **Запрос:** `GET http://localhost:5000/api/currency/<ID_созданной_валюты>`
    *   **Ожидаемый статус:** `200 OK`. **Ожидаемый ответ:** JSON-объект валюты.
    *   **Некорректный GET /currency/99999** (Несуществующий ID)
    *   **Ожидаемый статус:** `404 Not Found`. **Ожидаемый ответ:** `{"message": "Ошибка: Валюта не найдена."}`

*   **PUT /currency/:id** (Обновить валюту по ID)
    *   **Запрос:** `PUT http://localhost:5000/api/currency/<ID_созданной_валюты>`
    *   **Body (raw, JSON):** `{"name": "Обновленный Доллар"}`
    *   **Ожидаемый статус:** `200 OK`. **Ожидаемый ответ:** JSON-объект валюты с обновленным `name`.

*   **DELETE /currency/:id** (Удалить валюту по ID)
    *   **Запрос:** `DELETE http://localhost:5000/api/currency/<ID_созданной_валюты>`
    *   **Ожидаемый статус:** `200 OK`. **Ожидаемый ответ:** `{"message": "Валюта успешно удалена."}`
    *   **Некорректный DELETE /currency/99999** (Несуществующий ID)
    *   **Ожидаемый статус:** `404 Not Found`. **Ожидаемый ответ:** `{"message": "Ошибка: Валюта не найдена для удаления."}`

*   **GET /currency/:id/exists** (Проверить существование)
    *   **Запрос:** `GET http://localhost:5000/api/currency/<ID_созданной_валюты>/exists`
    *   **Ожидаемый статус:** `200 OK`. **Ожидаемый ответ:** `{"exists": true, "message": "Валюта найдена."}`
    *   **Некорректный GET /currency/99999/exists**
    *   **Ожидаемый статус:** `404 Not Found`. **Ожидаемый ответ:** `{"exists": false, "message": "Валюта не найдена."}`

### 2. Сущность `Rate` (Курсы обмена) - `/rate`

**(Создайте валюты USD и BYN через API `Currency` перед тестированием `Rate`!)**

*   **POST /rate** (Создать курс)
    *   **Body (raw, JSON):** `{"fromCurrencyId": <ID_USD>, "toCurrencyId": <ID_BYN>, "rate": 3.25}`
    *   **Ожидаемый статус:** `200 OK`. **Ожидаемый ответ:** JSON с созданным курсом.
    *   **Некорректный POST /rate** (несуществующие валюты)
    *   **Body (raw, JSON):** `{"fromCurrencyId": 9999, "toCurrencyId": <ID_BYN>, "rate": 3.0}`
    *   **Ожидаемый статус:** `404 Not Found`. **Ожидаемый ответ:** `{"message": "Одна или обе указанные валюты не найдены."}`
    *   **Некорректный POST /rate** (дубликат курса)
    *   **Body (raw, JSON):** `{"fromCurrencyId": <ID_USD>, "toCurrencyId": <ID_BYN>, "rate": 3.20}`
    *   **Ожидаемый статус:** `409 Conflict`. **Ожидаемый ответ:** `{"message": "Ошибка: Курс для этой пары валют уже существует. Используйте PUT для обновления."}`

*   **GET /rate** (Получить все курсы)
    *   **Запрос:** `GET http://localhost:5000/api/rate`
    *   **Ожидаемый статус:** `200 OK`. **Ожидаемый ответ:** JSON `{ "count": N, "rows": [...] }` (массив курсов, включая информацию о валютах).

*   **GET /rate/:id** (Получить курс по ID)
    *   **Запрос:** `GET http://localhost:5000/api/rate/<ID_созданного_курса>`
    *   **Ожидаемый статус:** `200 OK`. **Ожидаемый ответ:** JSON-объект курса с информацией о валютах.

*   **PUT /rate/:id** (Обновить курс по ID)
    *   **Запрос:** `PUT http://localhost:5000/api/rate/<ID_созданного_курса>`
    *   **Body (raw, JSON):** `{"rate": 3.30}`
    *   **Ожидаемый статус:** `200 OK`. **Ожидаемый ответ:** JSON-объект курса с обновленным `rate`.

*   **DELETE /rate/:id** (Удалить курс по ID)
    *   **Запрос:** `DELETE http://localhost:5000/api/rate/<ID_созданного_курса>`
    *   **Ожидаемый статус:** `200 OK`. **Ожидаемый ответ:** `{"message": "Курс успешно удален."}`

### 3. Сущность `Transaction` (Транзакции) - `/transaction`

**(Создайте курс через API `Rate` перед тестированием `Transaction`!)**

*   **POST /transaction** (Создать транзакцию)
    *   **Body (raw, JSON):** `{"rateId": <ID_курса>, "amountFrom": 50.00, "amountTo": 165.00}`
    *   **Ожидаемый статус:** `200 OK`. **Ожидаемый ответ:** JSON с созданной транзакцией.
    *   **Некорректный POST /transaction** (несуществующий курс)
    *   **Body (raw, JSON):** `{"rateId": 9999, "amountFrom": 50.00, "amountTo": 165.00}`
    *   **Ожидаемый статус:** `404 Not Found`. **Ожидаемый ответ:** `{"message": "Указанный курс не найден."}`

*   **GET /transaction** (Получить все транзакции)
    *   **Запрос:** `GET http://localhost:5000/api/transaction`
    *   **Ожидаемый статус:** `200 OK`. **Ожидаемый ответ:** JSON `{ "count": N, "rows": [...] }` (массив транзакций, включая информацию о курсах и валютах).

*   **GET /transaction/:id** (Получить транзакцию по ID)
    *   **Запрос:** `GET http://localhost:5000/api/transaction/<ID_созданной_транзакции>`
    *   **Ожидаемый статус:** `200 OK`. **Ожидаемый ответ:** JSON-объект транзакции.

*   **PUT /transaction/:id** (Обновить транзакцию по ID)
    *   **Запрос:** `PUT http://localhost:5000/api/transaction/<ID_созданной_транзакции>`
    *   **Body (raw, JSON):** `{"amountFrom": 60.00}`
    *   **Ожидаемый статус:** `200 OK`. **Ожидаемый ответ:** JSON-объект транзакции с обновленным `amountFrom`.

*   **DELETE /transaction/:id** (Удалить транзакцию по ID)
    *   **Запрос:** `DELETE http://localhost:5000/api/transaction/<ID_созданной_транзакции>`
    *   **Ожидаемый статус:** `200 OK`. **Ожидаемый ответ:** `{"message": "Транзакция успешно удалена."}`