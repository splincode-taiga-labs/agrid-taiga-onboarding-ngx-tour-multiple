# AG Grid + Taiga UI multiple onboarding prototype (ngx-ui-tour)

Учебный прототип двух последовательных онбордингов на Angular, Taiga UI, AG Grid и `ngx-ui-tour-tui-hint`.

Первый сценарий показывает заметки к маршруту и sidebar. После его завершения запускается второй независимый сценарий по колонкам таблицы. Порядок задается явно в `AppComponent`, без универсальной очереди.

```text
Travel notes tour
        ↓ await
Trip planning tour
```

Каждый feature-tour сам хранит свой `localStorage`-ключ и вызывает `TourService.initialize(...)` непосредственно перед запуском. Поэтому один singleton `TourService` используется последовательно несколькими feature-сервисами, а бизнес-порядок остается видимым в orchestration-коде.

## Запуск

```bash
npm install
npm start
```

## Что показывает пример

- nullable DI tokens и отдельные feature flags для двух онбордингов;
- последовательный `await first.run(); await second.run();` вместо hidden queue;
- `completed | dismissed | skipped` как минимальный результат запуска;
- первый tour с target внутри AG Grid cell и последующими шагами в sidebar;
- второй tour с anchor на Angular header-компонентах AG Grid;
- прокрутку к нужной колонке перед переходом на следующий async anchor;
- независимые версии и `localStorage`-ключи для разных сценариев.

Для ручного повтора используйте кнопку `Запустить оба онбординга`: она игнорирует сохраненное состояние обоих сценариев.
