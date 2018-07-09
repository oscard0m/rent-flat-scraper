import cors from "cors";
import express from "express";
import http from "http";
import { Server } from "typescript-rest";
import controllers from "../src/controllers";

export class ApiServer {

  private app: express.Application;
  private server: http.Server | null = null;
  private PORT: number = 1337;

  constructor() {
    this.app = express();
    this.config();

    Server.useIoC();
    Server.buildServices(this.app, ...controllers);
  }

  public start(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.server = this.app.listen(this.PORT, (err: any) => {
        if (err) {
          return reject(err);
        }
        // tslint:disable-next-line:no-console
        console.log(`Server Running at http://localhost:${this.PORT} !`);
        return resolve();
      });
    });
  }

  public stop(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      if (this.server) {
        this.server.close(() => {
          return resolve(true);
        });
      } else {
        return resolve(true);
      }
    });
  }

  private config(): void {
    this.app.use(cors());
  }

}
