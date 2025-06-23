import {Separator} from "@/components/ui/separator"
import {SidebarTrigger} from "@/components/ui/sidebar"
import {useAppSelector} from "@/hooks.ts";
import {App} from "@/models/app.ts"
import {Offerwall} from "@/pages/Offerwall.tsx";

const SiteHeader = () => {
    const app: App = useAppSelector(state => state.app)

    return (
        <header
            className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger/>

                <Separator
                    orientation="vertical"
                    className="mx-2 data-[orientation=vertical]:h-4"
                />
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