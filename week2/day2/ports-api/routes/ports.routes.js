import { Router } from "express";
const router = Router();
import { getAllPorts,getPortByCode,createPort , deletePort} from "../controllers/ports.controller.js";

router.get('/',getAllPorts);

router.get('/:code' , getPortByCode);


router.post("/",createPort)

router.delete("/:code",deletePort)

export default router;