import { fluentProvide } from "inversify-binding-decorators";
import { IRenderService } from "../../interfaces.js";

@fluentProvide(IRenderService).whenTargetTagged("ink", true).done()
export class InkService implements IRenderService {
    run(): void {

    }
}
