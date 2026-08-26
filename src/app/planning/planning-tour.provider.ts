import {inject, InjectionToken, type Provider} from '@angular/core';

import {APP_CONFIG} from '../app-config';
import {TripPlanningTourService} from './planning-tour.service';

export const TRIP_PLANNING_TOUR = new InjectionToken<TripPlanningTourService | null>(
    '[TRIP_PLANNING_TOUR]: TripPlanningTourService',
);

export function provideTripPlanningTour(): Provider {
    return [
        TripPlanningTourService,
        {
            provide: TRIP_PLANNING_TOUR,
            useFactory: () => {
                if (inject(APP_CONFIG).features?.enableTripPlanningTour !== true) {
                    return null;
                }

                return inject(TripPlanningTourService);
            },
        },
    ];
}
