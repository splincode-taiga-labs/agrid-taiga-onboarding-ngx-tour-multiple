import {TravelPlanDto} from '../proposal.dto';

export const TRAVEL_PLANS: readonly TravelPlanDto[] = [
    {
        id: 1,
        title: 'Киото и Нара',
        country: 'Япония',
        season: 'Весна',
        durationDays: 8,
        status: 'Планируется',
    },
    {
        id: 2,
        title: 'Лиссабон и Синтра',
        country: 'Португалия',
        season: 'Осень',
        durationDays: 6,
        status: 'Идея',
    },
    {
        id: 3,
        title: 'Таллин и острова',
        country: 'Эстония',
        season: 'Лето',
        durationDays: 5,
        status: 'Забронировано',
    },
    {
        id: 4,
        title: 'Рим и Флоренция',
        country: 'Италия',
        season: 'Весна',
        durationDays: 9,
        status: 'Идея',
    },
    {
        id: 5,
        title: 'Сеул и Сокчхо',
        country: 'Южная Корея',
        season: 'Осень',
        durationDays: 10,
        status: 'Планируется',
    },
];
