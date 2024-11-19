import express, { Request, Response } from 'express';
import ClientAdmFacadeFactory from '../../../domain/client-adm/factory/facade.factory';
import { AddClientFacadeInputDto } from '../../../domain/client-adm/facade/client-adm.facade.interface';
import ClientAdmFacade from '../../../domain/client-adm/facade/client-adm.facade';

export const clientRoute = express.Router();

clientRoute.post("/", async (req: Request, res: Response) => {
    const clientFacade = ClientAdmFacadeFactory.create();

    try {

        const clientDto = {
            id: req.body.id,
            name: req.body.name,
            document: req.body.document,
            email: req.body.email,
            street: req.body.street,
            number: req.body.number,
            complement: req.body.complement,
            city: req.body.city,
            state: req.body.state,
            zipCode: req.body.zipCode,
      };
      await clientFacade.add(clientDto);

      const output = await clientFacade.find({ id: clientDto.id });
      res.send(output);
  }catch (err) {
    if (err instanceof Error) {
        res.status(400).send(err.message);
    }else{
        res.status(500).send(err);
    }
  }
});