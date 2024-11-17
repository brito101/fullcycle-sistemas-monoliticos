import express, { Request, Response } from "express";
import ClientAdmFacadeFactory from "../../../domain/modules/client-adm/factory/client-adm.facade.factory";
import Address from "../../../domain/modules/@shared/domain/value-object/address";

export const clientRoute = express.Router();

clientRoute.post("/", async (req: Request, res: Response) => {
  const clientFacade = ClientAdmFacadeFactory.create();

  try {
    const clientDto = {
      id: req.body.id,
      name: req.body.name,
      document: req.body.document,
      email: req.body.email,
      address: new Address(
        req.body.street,
        req.body.number,
        req.body.complement,
        req.body.city,
        req.body.state,
        req.body.zipCode
      ),
    };

    await clientFacade.add(clientDto);

    const output = await clientFacade.find({ id: clientDto.id });
    res.send(output);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).send(err.message);
    } else {
      res.status(500).send(err);
    }
  }
});
