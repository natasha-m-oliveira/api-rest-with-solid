import { User } from '../../entities/User';
import { IMailProvider } from '../../providers/IMailProvider';
import { IUsersRepository } from '../../repositories/IUsersRepository';
import { ICreateUserRequestDTO } from './CreateUserDTO';

/**
 * Aqui aplicamos o Sigle responsibility principle, ou seja, a criação do usuário, ela não tem a responsabilidade
  de como que esse usuário vai ser salvo.
 * E como use case tem apenas um método execute, nunca vamos ter uma lógica replicada entre vários
  lugares da nossa aplicação, então qualquer outro lugar da nossa aplicação que precisar criar um usuário
  não interessando se esse pedido está vindo do admin, do próprio usuário ou de uma integração com terceiros
  vai passar por esse arquivo, que detém toda a lógica, regra de negócio de como criar um usuário
  dentro da minha aplicação.
 * E também estamos aplicando o Liskov substitution principle a partir do momento que estamos recebendo o nosso
  usersRepository e falando que o tipo dele é um IUsersRepository, uma interface, um contrato que define quais são os
  métodos que vão existir dentro do repositório, não interessa qual o db vamos utilizar, se tiver esses métodos
  nossa lógica vai continuar funcionado.
 * Por último, o Dependency inversion principle, onde eu não estou dependendo diretamente da implementação
  do usersRepository, e sim da abstração daquela implementação
*/
export class CreateUserUseCase {
  constructor (
    private usersRepository: IUsersRepository,
    private mailProvider: IMailProvider,
  ){}

  async execute(data: ICreateUserRequestDTO) {
    const userAlreadyExists = await this.usersRepository.findByEmail(data.email);

    if (userAlreadyExists) {
      throw new Error('User already exists.');
    }

    const user = new User(data);

    await this.usersRepository.save(user);

    await this.mailProvider.sendMail({
      to: {
        name: data.name,
        email: data.email,
      },
      from: {
        name: 'Equipe do Meu App',
        email: "equipe@meuapp.com"
      },
      subject: 'Seja bem-vindo à plataforma',
      body: '<p>Você já pode fazer login em nossa plataforma.</p>'
    })
  }
}