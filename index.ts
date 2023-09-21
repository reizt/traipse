import { welcomeMessage } from 'src/welcome';

const projectName: string = 'TypeScript Starter';

const message = welcomeMessage(projectName);

console.log(message);

export { projectName };
