import { uuid } from 'uuidv4';

export class User {
  public readonly id: string;

  public name: string;
  public email: string;
  public password: string;

  // todas as propriedades da classe será utilizadas, exceto id
  constructor(props: Omit<User, 'id'>, id?: string) {
    // vamos pegar todas as propriedades do objeto props e passar para dentro do this
    // seria o mesmo que this.name = props.name
    Object.assign(this, props);

    if (!id) {
      this.id = uuid();
    }
  }
}
