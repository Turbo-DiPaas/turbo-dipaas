import {Logger} from "../types/Logger";
import Container from "typedi";
import constants from "../config/constants";

const getLogger = (): Logger => {
    return Container.get<Logger>(constants.ids.logger)
}

export { getLogger }