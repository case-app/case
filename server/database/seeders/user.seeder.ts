import * as sha3 from 'crypto-js/sha3'
import * as faker from 'faker/locale/fr'
import { DataSource, EntityManager } from 'typeorm'

import { Notification } from '../../src/resources/case/notification.entity'
import { Role } from '../../src/resources/case/role.entity'
import { User } from '../../src/resources/user/user.entity'
import { colors } from './content/colors.content'

export class UserSeeder {
  entityManager: EntityManager
  count: number

  constructor(dataSource: DataSource, count: number) {
    this.entityManager = dataSource.manager
    this.count = count
  }

  async seed(): Promise<User[]> {
    console.log('\x1b[35m', '[] Seeding users...')

    const saveUserPromises: Promise<User>[] = Array.from(Array(this.count)).map(
      async (_item, index: number) => {
        return this.entityManager.save(
          index === 0 ? await this.getAdminUser() : await this.getUser()
        )
      }
    )

    return Promise.all(saveUserPromises).then((res) => {
      return res
    })
  }

  private async getUser(): Promise<User> {
    const teamMemberRole: Role = await this.entityManager.findOneOrFail(Role, {
      where: {
        name: 'teamMember'
      }
    })

    const firstName: string = faker.name.firstName()
    const lastName: string = faker.name.lastName()

    const user: User = this.entityManager.create(User, {
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${faker.datatype.number(
        {
          min: 1,
          max: 999
        }
      )}@case.app`,
      password: sha3('azerty').toString(),
      image:
        'users/' +
        faker.datatype.number({
          min: 1,
          max: 10
        }),
      token: faker.random.alphaNumeric(20),
      isGhost: false,
      isActive: true,
      color: faker.random.arrayElement(colors),
      role: teamMemberRole
    })

    // Welcome notification for each user.
    user.notifications = [
      await this.entityManager.save(
        this.entityManager.create(Notification, {
          description: `Bienvenue dans l'application`,
          date: faker.date.recent(
            faker.datatype.number({
              min: 1,
              max: 500
            })
          )
        })
      )
    ]

    return user
  }

  private async getAdminUser(): Promise<User> {
    const adminRole: Role = await this.entityManager.findOneOrFail(Role, {
      where: {
        name: 'admin'
      }
    })

    const user: User = this.entityManager.create(User, {
      name: 'Admin CASE',
      email: 'admin@case.app',
      password: sha3('case').toString(),
      image: 'users/admin',
      token: faker.random.alphaNumeric(20),
      isGhost: false,
      isActive: true,
      color: faker.random.arrayElement(colors),
      role: adminRole
    })

    // Welcome notification for each user.
    user.notifications = [
      await this.entityManager.save(
        this.entityManager.create(Notification, {
          description: `Bienvenue dans l'application, vous ??tes admin`,
          date: faker.date.recent(faker.datatype.number({ min: 1, max: 500 }))
        })
      )
    ]

    return user
  }
}
