const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

function isValidUuid(request, res, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return res.status(400).json({error: 'id is not valid'});
  }

  return next();
}

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);
  
  return response.json(repository);
});

app.put("/repositories/:id", isValidUuid, (request, response) => {
  const { id } = request.params;
  const indexId = repositories.findIndex((r) => r.id === id);

  if (indexId < 0) {
    return res.status(400).json({ error: 'Repository not found'});
  }

  const { title, url, techs } = request.body;
  const repository = { id, title, url, techs };
  repositories[indexId] = {...repositories[indexId], ...repository}; 

  return response.json(repositories[indexId]);

});

app.delete("/repositories/:id", isValidUuid, (request, response) => {
  const { id } = request.params;
  const indexId = repositories.findIndex((r) => r.id === id);

  if (indexId < 0) {
    return response.status(400).json({ error: 'Repository not found'});
  }

  repositories.splice(indexId, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", isValidUuid, (request, response) => {
  const { id } = request.params;

  const indexId = repositories.findIndex((r) => r.id === id);

  if (indexId < 0) {
    return response.status(400).json({error: 'Repository not found'});
  }

  repositories[indexId].likes += 1;

  return response.json({likes: repositories[indexId].likes});

});

module.exports = app;
