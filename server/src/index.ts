import cors from "@fastify/cors";
import Fastify from "fastify";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { videoRoutes } from "./routes";

const app = Fastify().withTypeProvider();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(cors);
app.register(videoRoutes);

app.setErrorHandler((err, req, reply) => {
  if (err.validation) {
    reply.status(400).send({ error: "Validation error", message: err.message });
  } else {
    req.log.error(err);
    reply.status(500).send({ error: "Internal Server Error" });
  }
});

app.listen({ port: 3001 }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log(`🚀 Server running at ${address}`);
});
