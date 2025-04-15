import { Injectable } from '@nestjs/common';
import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import { User } from '../users/schemas/user.schema';

export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete';
export type Subjects = typeof User | User | 'all';

export type AppAbility = any;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

    if (user.roles.includes('admin')) {
      can('manage', 'all'); // admin can manage all resources
    } else {
      can('read', User); // regular users can read all users
      can(['update', 'delete'], User, { username: user.username }); // users can update/delete themselves
    }

    return build();
  }
}