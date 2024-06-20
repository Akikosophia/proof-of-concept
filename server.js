// Importeer het npm pakket express uit de node_modules map
import express, { application, json, request } from "express";

// Importeer de zelfgemaakte functie fetchJson uit de ./helpers map
import fetchJson from "./helpers/fetch-json.js";

// Maak een nieuwe express app aan
const app = express();

// Stel ejs in als template engine
app.set("view engine", "ejs");

// Stel de map met ejs templates in
app.set("views", "./views");

// Gebruik de map 'public' voor statische resources, zoals stylesheets, afbeeldingen en client-side JavaScript
app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

// Stel het basis endpoint in
const apiUrl = "https://fdnd-agency.directus.app/items/deloitte_";

const apiPrompts = apiUrl + "prompts";

const ApiSub = apiUrl + "subcategories";

// Home pagina
// laadt in wanneer dat nodig is
app.get("/", async function (request, response) {
  try {


    // Ophalen van categorieën
// Hier verstuur ik een verzoek naar de api om de categorieën op te halen dit doe ik met de fetchJson 
// Server geeft de data terug in JSON gegevens
// De await wacht tot FetchJson functie is gelukt
    const categories = await fetchJson(apiUrl + "categories");

    // Mappen van categorieën naar een formaat dat de front-end kan verwerken
//  Er word een nieuwe map toegevoegd, 
// De map maakt een nieuwere versie van de opgehaalde categories
// Hij wacht eerst tot alle promises zijn uitgevoerd en als dit gelukt is. 
// Ik haal de subcategorieën op
// Dan maak ik een constante variabele voor de subcategories

    const categoriesWithSubcategories = await Promise.all(
      categories.data.map(async (category) => {
        const subcategories = await Promise.all(
          category.subcategories.map(async (subcategoryId) => {
            const subcategory = await fetchJson(
              `${apiUrl}subcategories/${subcategoryId}`
            );

// Voor elk categorie worden de subcategorieën opgehaald.
// Voor elke subcategorie-ID in category.subcategories sturen we een verzoek om de details van de subcategorie op te halen
// Met FetchJson verzoek haal je de data van de subcategorie op
// Met return geef je de gegevens van het object terug 
// En geef je dit een nieuw object mee
// Dus dat zijn category.id, category.name, subcategories.

            // console.log("subcategory" + subcategory.data.name);
            console.log("subcategory object" + subcategory);
            return subcategory;
          })
        );
        console.log(subcategories);
        return {
          id: category.id,
          name: category.name,
          subcategories: subcategories,
        };
      })
    );


    console.log(categoriesWithSubcategories);
    
    // Ophalen van prompts

// Verstuur een verzoek om de prompts op te halen van de api.
// Resonse en render je de homepage
// En geef je de gegevens mee


    const promptsResponse = await fetchJson(apiUrl + "prompts");

    // Renderen van de home pagina met de opgehaalde gegevens
    response.render("home", {
      categories: categoriesWithSubcategories,
      prompts: promptsResponse.data,
      // prompts: promptsWithSubcategories
    });
    
  } catch (error) {
    console.error("Er was een probleem met het ophalen van gegevens:", error);
    response
      .status(500)
      .send("Er is een fout opgetreden bij het ophalen van gegevens.");
  }
});


// app.get("/audit", async function (request, response) {
//   try {
//     const items = await fetchJson(apiUrl + "subcategories");
//     const filteredData = items.data.filter((item) => {
//       return item.category == 1;
//     });
//     const promptsResponse = await fetchJson(apiUrl + "prompts");

//     const filteredPrompts = promptsResponse.data.filter((item) => {
//       return item.subcategorie == 2;
//     })

//     response.render("audit", {
//       subcategories: filteredData,
//       prompts: filteredPrompts,
//     });
//   } catch (error) {
//     console.error("Er was een probleem met het ophalen van gegevens:", error);
//     response
//       .status(500)
//       .send("Er is een fout opgetreden bij het ophalen van gegevens.");
//   }
// });

// app.get("/innovation", async function (request, response) {
//   try {
//     const items = await fetchJson(apiUrl + "subcategories");
//     var subCategoryId = [];
//     const filteredData = items.data.filter((item) => {
//       console.log(item);
//       if(item.category == 2) {
//         subCategoryId.push(item.subcategory_id);
//       }

//       return item.category == 2;
//     });
//     const promptsResponse = await fetchJson(apiUrl + "prompts");
//     const filteredPrompts = promptsResponse.data.filter((item) => {
//       return subCategoryId.includes(item.subcategory_id);
//     })

//     console.log(filteredPrompts);

//     response.render("innovation", {
//       subcategories: filteredData,
//       prompts: filteredPrompts,
//     });
//   } catch (error) {
//     console.error("Er was een probleem met het ophalen van gegevens:", error);
//     response
//       .status(500)
//       .send("Er is een fout opgetreden bij het ophalen van gegevens.");
//   }
// });

// app.get("/consulting", async function (request, response) {
//   try {
//     const items = await fetchJson(apiUrl + "subcategories");
//     const filteredData = items.data.filter((item) => {
//       return item.category == 3;
//     });
//     const promptsResponse = await fetchJson(apiUrl + "prompts");

//     const filteredPrompts = promptsResponse.data.filter((item) => {
//       return item.subcategorie == 2;
//     })

//     response.render("consulting", {
//       subcategories: filteredData,
//       prompts: filteredPrompts,
//     });
//   } catch (error) {
//     console.error("Er was een probleem met het ophalen van gegevens:", error);
//     response
//       .status(500)
//       .send("Er is een fout opgetreden bij het ophalen van gegevens.");
//   }
// });

// audit
// app.get("/audit/:id", function (request, response) {

//   const categoryId = request.params.id;
//   console.log("categoryId" + categoryId);
//   fetchJson(apiUrl + "prompts").then((items) => { 
//     const prompts = items.data.filter((item) => {
//       console.log("audit log item" + item);
//       return item.subcategorie == categoryId;
//     });
//     console.log(prompts);
//     response.render("audit", {
//       prompts: prompts,
//     });
//   });
// });

// app.get("/innovation/:id", function (request, response) {
//   const categoryId = request.params.id;
//   console.log("categoryId" + categoryId);
//   fetchJson(apiUrl + "prompts").then((items) => { 
//     const prompts = items.data.filter((item) => {
//       console.log(item);
//       return item.subcategorie == categoryId;
//     });
//     console.log(prompts);
//     response.render("innovation", {
//       prompts: prompts,
//     });
//   });
// });

// app.get("/consulting/:id", function (request, response) {
//   const categoryId = request.params.id;
//   console.log("categoryId" + categoryId);
//   fetchJson(apiUrl + "prompts").then((items) => { 
//     const prompts = items.data.filter((item) => {
//       console.log(item);
//       return item.subcategorie == categoryId;
//     });
//     console.log(prompts);
//     response.render("consulting", {
//       prompts: prompts,
//     });
//   });
// });

// const deloitteFinancial = await fetchJson(apiUrl + 'items/deloitte_prompts?filter[id][_eq]=1')
// const promptMessages = [];

// // Route to financialReview.ejs
// app.get('/financialReview',  async function(request, response){
//   // binnen de financial review render geef ik de data van de url: https://fdnd-agency.directus.app/items/deloitte_prompts?filter[id][_eq]=1 
//   // hier haal ik en weergeef ik de tekst door allPrompts te renderen in financialReview.ejs
//   // promptMessages is de ingevoerde data in de form die ook word gerenderd in financialReview.ejs dit komt vanuit de lege array const promptMessages = [];
//   response.render('financialReview', {
//       prompts: deloitteFinancial.data,
//       promptMessages: promptMessages 
//   });
// });


// Ik maak een get route voor audit/:id.
// Waarbij de :id een dynamische parameter is.
// Async function gebruik ik omdat ik ook de await ga gebruiken
// Als de request.params.id die gelijk is aan de categorie haalt hij op die op

app.get("/audit/:id", async (request, response) => {
  const categoryId = request.params.id;
  console.log("categoryId: " + categoryId);
  const fetchJson = (url) => fetch(url).then(response => response.json());

//   FetchJson functie neemt een url als parameter
// Fetch (url) doet een http get verzoek naar de url en geeft een Promise terug die een object bevat

  try {

    // Fetch prompts and variables concurrently
    const [promptsData, variablesData] = await Promise.all([
      fetchJson(apiUrl + "prompts"),
      fetchJson(apiUrl + "variables")
    ]);


    // Filter prompts by category
// Ik maak een constante variabele voor de prompts data 
// Ik filter item subcategorie in de prompts dat gelijk moet zijn aan de category id
// Als er tijdens het filteren geen categorie gelijk zijn 
// Als prompts length nul leeg is dan word er een leeg object mee gegeven
// Dit zorgt dat juist gerenderd word ook als er niks te zien is
    const prompts = promptsData.data.filter(item => item.subcategorie == categoryId);
    if (prompts.length === 0) {
      return response.render("audit", { prompts: [], variables: [] });
    }


    // Map variable IDs to their details
    const variableMap = variablesData.data.reduce((map, variable) => {
      map[variable.id] = { label: variable.label, type: variable.type };
      return map;
    }, {});


    // Replace placeholders in prompts with input fields    
    // Hier de vervang ik de placeholders in de prompts met invoervelden met switch en replace

    const formattedPrompts = prompts.map(prompt => {
      let formattedText = prompt.text;
      prompt.variables.forEach(variableId => {
        const variable = variableMap[variableId];
        let inputField;
        switch (variable.type) {
          case 'FILE':
            inputField = `<input type="file" name="${variable.label}" />`;
            break;
          case 'DATETIME_LOCAL':
            inputField = `<input type="datetime-local" name="${variable.label}" />`;
            break;
          case 'TEXT':
            inputField = `<input type="text" name="${variable.label}" placeholder="Enter ${variable.label}" />`;
            break;
          default:
            inputField = `<input type="text" name="${variable.label}" />`;
        }
        const placeholder = new RegExp(`{{\\s*${variable.label}\\s*}}`, 'g');
        formattedText = formattedText.replace(placeholder, inputField);
      });
      return { ...prompt, text: formattedText };
    });


    response.render("audit", {
      prompts: formattedPrompts,
      variables: variablesData.data,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    response.status(500).send("Internal Server Error");
  }
});

app.get("/innovation/:id", async (request, response) => {
  const categoryId = request.params.id;
  console.log("categoryId: " + categoryId);
  const fetchJson = (url) => fetch(url).then(response => response.json());


  try {
    // Fetch prompts and variables concurrently
    const [promptsData, variablesData] = await Promise.all([
      fetchJson(apiUrl + "prompts"),
      fetchJson(apiUrl + "variables")
    ]);


    // Filter prompts by category
    const prompts = promptsData.data.filter(item => item.subcategorie == categoryId);
    if (prompts.length === 0) {
      return response.render("innovation", { prompts: [], variables: [] });
    }


    // Map variable IDs to their details
    const variableMap = variablesData.data.reduce((map, variable) => {
      map[variable.id] = { label: variable.label, type: variable.type };
      return map;
    }, {});


    // Replace placeholders in prompts with input fields
    const formattedPrompts = prompts.map(prompt => {
      let formattedText = prompt.text;
      prompt.variables.forEach(variableId => {
        const variable = variableMap[variableId];
        let inputField;
        switch (variable.type) {
          case 'FILE':
            inputField = `<input type="file" name="${variable.label}" />`;
            break;
          case 'DATETIME_LOCAL':
            inputField = `<input type="datetime-local" name="${variable.label}" />`;
            break;
          case 'TEXT':
            inputField = `<input type="text" name="${variable.label}" placeholder="Enter ${variable.label}" />`;
            break;
          default:
            inputField = `<input type="text" name="${variable.label}" />`;
        }
        const placeholder = new RegExp(`{{\\s*${variable.label}\\s*}}`, 'g');
        formattedText = formattedText.replace(placeholder, inputField);
      });
      return { ...prompt, text: formattedText };
    });


    response.render("innovation", {
      prompts: formattedPrompts,
      variables: variablesData.data,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    response.status(500).send("Internal Server Error");
  }
});


app.get("/consulting/:id", async (request, response) => {
  const categoryId = request.params.id;
  console.log("categoryId: " + categoryId);
  const fetchJson = (url) => fetch(url).then(response => response.json());


  try {
    // Fetch prompts and variables concurrently
    const [promptsData, variablesData] = await Promise.all([
      fetchJson(apiUrl + "prompts"),
      fetchJson(apiUrl + "variables")
    ]);


// Filter prompts by category
// Ik maak een constante variabele voor de prompts data 
// Ik filter item subcategorie in de prompts dat gelijk moet zijn aan de category id
// Als er tijdens het filteren geen categorie gelijk zijn 
// Als prompts length nul leeg is dan word er een leeg object mee gegeven
// Dit zorgt dat juist gerenderd word ook als er niks te zien is
    const prompts = promptsData.data.filter(item => item.subcategorie == categoryId);
    if (prompts.length === 0) {
      return response.render("consulting", { prompts: [], variables: [] });
    }


    // Map variable IDs to their details
    const variableMap = variablesData.data.reduce((map, variable) => {
      map[variable.id] = { label: variable.label, type: variable.type };
      return map;
    }, {});


    // Replace placeholders in prompts with input fields
    const formattedPrompts = prompts.map(prompt => {
      let formattedText = prompt.text;
      prompt.variables.forEach(variableId => {
        const variable = variableMap[variableId];
        let inputField;
        switch (variable.type) {
          case 'FILE':
            inputField = `<input type="file" name="${variable.label}" />`;
            break;
          case 'DATETIME_LOCAL':
            inputField = `<input type="datetime-local" name="${variable.label}" />`;
            break;
          case 'TEXT':
            inputField = `<input type="text" name="${variable.label}" placeholder="Enter ${variable.label}" />`;
            break;
          default:
            inputField = `<input type="text" name="${variable.label}" />`;
        }
        const placeholder = new RegExp(`{{\\s*${variable.label}\\s*}}`, 'g');
        formattedText = formattedText.replace(placeholder, inputField);
      });
      return { ...prompt, text: formattedText };
    });


    response.render("consulting", {
      prompts: formattedPrompts,
      variables: variablesData.data,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    response.status(500).send("Internal Server Error");
  }
});

// audit
// app.get("/audit", function (request, response) {
//   // fetchJson(apiUrl + "subcategories").then((items) => {
//   fetchJson(apiUrl + "prompts").then((items) => {
//     console.log(items.data);
//     response.render("audit", {
//       prompts: items.data,
//     });
//   });
// });

// // innovation
// app.get("/innovation", function (request, response) {
//   // fetchJson(apiUrl + "subcategories").then((items) => {
//   fetchJson(apiUrl + "prompts").then((items) => {
//     console.log(items.data);
//     response.render("innovation", {
//       prompts: items.data,
//     });
//   });
// });


// // consulting
// app.get("/consulting", function (request, response) {
//   // fetchJson(apiUrl + "subcategories").then((items) => {
//   fetchJson(apiUrl + "prompts").then((items) => {
//     console.log(items.data);
//     response.render("audit", {
//       prompts: items.data,
//     });
//   });
// });


// Stel het poortnummer in waar express op moet gaan luisteren
app.set("port", process.env.PORT || 8002);

// Start express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get("port"), function () {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get("port")}`);
});