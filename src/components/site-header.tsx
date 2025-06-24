import {Separator} from "@/components/ui/separator"
import {useAppSelector} from "@/hooks.ts";
import {App} from "@/models/app.ts"

const SiteHeader = () => {
    const app: App = useAppSelector(state => state.app)

    return (
        <header
            className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
            <div className="flex w-full items-center gap-1 px-2 lg:gap-2 lg:px-4">

                <h1 className="text-base font-medium">
                    {app.currentPage === 'offerwall' && "Offerwall"}
                    {app.currentPage === 'questions' && "Profiling Questions"}
                    {app.currentPage === 'demographics' && "User Demographics"}
                    {app.currentPage === 'task_attempts' && "Task Attempts"}
                    {app.currentPage === 'cashout_methods' && "Cashout Methods"}
                    {app.currentPage === 'transaction_history' && 'Transaction History'}
                </h1>

            </div>
        </header>
    )
}

export {SiteHeader}