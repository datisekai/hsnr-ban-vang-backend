import { RolesBuilder } from 'nest-access-control';

export enum AppRoles {
  FREE = 'free_user',
  PREMIUM = 'premium_user',
  ADMIN = 'admin',
}

export enum FilmType {
  MOVIE = 'movie',
  SERIES = 'series',
}

export enum AppResource {
  USER = 'USER',
  CATEGORY = 'CATEGORY',
  FILM = 'FILM',
  EPISODE = 'EPISODE',
  RATING = 'RATING',
  ARTICLE = 'ARTICLE',
  HISTORY = 'HISTORY',
  UPLOAD = 'UPLOAD',
  COMMENT = 'COMMENT',
  ORDER = 'ORDER',
  FAVOURITE = 'FAVOURITE',
  FIREBASE = 'FIREBASE',
  HSNR = 'HSNR',
  META = 'META',
  SIEUTHICODE='SIEUTHICODE'
}

export const roles: RolesBuilder = new RolesBuilder();

roles
  // USER ROLES
  .grant(AppRoles.FREE)
  .createAny([AppResource.COMMENT, AppResource.ORDER, AppResource.FAVOURITE])
  .updateOwn([
    AppResource.USER,
    AppResource.CATEGORY,
    AppResource.FILM,
    AppResource.EPISODE,
  ])
  .deleteOwn([
    AppResource.USER,
    AppResource.CATEGORY,
    AppResource.FILM,
    AppResource.EPISODE,
  ])

  .grant(AppRoles.PREMIUM)
  .extend(AppRoles.FREE)

  // ADMIN ROLES
  .grant(AppRoles.ADMIN)
  .extend(AppRoles.PREMIUM)
  .createAny([
    AppResource.USER,
    AppResource.CATEGORY,
    AppResource.FILM,
    AppResource.EPISODE,
    AppResource.UPLOAD,
    AppResource.ARTICLE,
    AppResource.META,
  ])
  .updateAny([
    AppResource.USER,
    AppResource.CATEGORY,
    AppResource.FILM,
    AppResource.EPISODE,
    AppResource.ARTICLE,
    AppResource.META,
  ])
  .deleteAny([
    AppResource.USER,
    AppResource.CATEGORY,
    AppResource.FILM,
    AppResource.EPISODE,
    AppResource.ARTICLE,
    AppResource.META,
  ]);
