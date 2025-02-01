import { expect, mock, test } from "bun:test";

import { DatabaseUser } from "@/lib/db/schema/auth";
import { newid } from "@/lib/utils";
import { PlayerModel } from "@/types/tournaments";
import { faker } from "@faker-js/faker";

const INITIAL_WINS = 0;

const COLOUR_INDEX_FAKEOPTS = {
  min: -10,
  max: 10
};

const RATING_FAKEOPTS = {
  min:500,
  max:3000
};

const generateDatabasePlayer = mock(
  () => {
    const randomId = newid();
    const randomNickname = faker.internet.username();
    const randomRealName = faker.person.fullName();
    const randomRating = faker.number.float(RATING_FAKEOPTS);
    const randomEmail = faker.internet.email();
    const randomClubName = faker.company.name();
    const randomCreationDate = faker.date.anytime();
    const randomUser: DatabaseUser = {
      id: randomId,
      username: randomNickname,
      name: randomRealName,
      email: randomEmail, 
      rating: randomRating,
      selected_club: randomClubName,
      created_at: randomCreationDate
    };
    return randomUser;
  }
)

const generatePlayerModel = mock(
  () => {
    const randomUser = generateDatabasePlayer();
    const randomPlayer: PlayerModel = {
      id: randomId,
      nickname: randomNickname, 
      wins: 0,
      draws: 0,
      losses: 0,
      color_index: 0,
      realname: randomRealName,
      rating: randomRating,
      exited: null,
      place: null,
    }
    
    
  }
)

const randomName = faker.person.fullName();

test("2 + 2", () => {
  expect(2 + 2).toBe(4);
});

