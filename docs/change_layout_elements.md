Чтобы изменить меню, футер, хедер layout:
src\Layouts\Footer.tsx
src\Layouts\LayoutMenuData.tsx

## Путь загрузки VerticalLayout:

1. **index.tsx** → рендерит `<App />`
2. **App.tsx** → рендерит `<Route />` (импорт из `./Routes`)
3. **Routes/index.tsx** → импортирует `VerticalLayout from "../Layouts/index"`
4. **Layouts/index** → это и есть ваш `src\Layouts\VerticalLayouts\index.tsx`

## Ключевые моменты:

### В Routes/index.tsx:
```typescript
import VerticalLayout from "../Layouts/index";
//                              ↑
//                    Это ссылается на src/Layouts/index
```

### Для защищенных роутов:
```typescript
{authProtectedRoutes.map((route, idx) => (
    <Route
        path={route.path}
        element={
            <AuthProtected>
                <VerticalLayout>{route.component}</VerticalLayout>
                //     ↑
                //   Ваши страницы оборачиваются в VerticalLayout
            </AuthProtected>}
        key={idx}
    />
))}
```

## Проверьте файл:
**`src/Layouts/index.tsx`** (или `src/Layouts/index.ts`)

Скорее всего там:
```typescript
export { default } from './VerticalLayouts';
// или
import VerticalLayout from './VerticalLayouts';
export default VerticalLayout;
```

## Как это работает:
1. Ваши страницы (включая BanksList, CounterpartiesList) попадают в `authProtectedRoutes`
2. При рендере они автоматически оборачиваются в `<VerticalLayout>`
3. VerticalLayout предоставляет структуру: меню, хедер, футер, etc.

**Проверьте файл `src/Layouts/index.tsx` - там должен быть реэкспорт VerticalLayouts.**

