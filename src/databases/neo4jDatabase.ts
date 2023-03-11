import neo4j from "neo4j-driver";
import { neo4jConfig } from "../config/config";

const {url,user,password}=neo4jConfig

const neo4jDriver = neo4j.driver(url, neo4j.auth.basic(user, password));
export default neo4jDriver;
