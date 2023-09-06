import Page from "../../../components/Shared/Page/Page"
import PageTitle from "../../../components/Shared/Page/PageTitle/PageTitle"
import Sidebar from "../../../components/Shared/Sidebar/Sidebar"


const Backlog = () => {

    return(
		<Sidebar>
			<Page>
                <PageTitle title="Backlog" />
                <div className="mt-[30px] mb-[10px]">
                    <div className="flex gap-7">
                        <div className="h-[560px] w-[364px] bg-[#F3F7FF] rounded-[7px] p-[7px] box-border flex flex-col gap-6">
                            <div>
                                <span className="text-[16px] text-[#004A8E]">To Do</span>
                            </div>
                            <div className="flex flex-col gap-[6px]">
                                <div className="bg-white w-[346px] h-[60px] shadow-userStory p-[4px] box-border">

                                </div>
                                <div className="bg-white w-[346px] h-[60px] shadow-userStory p-[4px] box-border">
                                
                                </div>
                            </div>
                        </div>

                        <div className="h-[560px] w-[364px] bg-[#F3F7FF] rounded-[7px] p-[7px] box-border flex flex-col gap-6">
                            <div>
                                <span className="text-[16px] text-[#004A8E]">In Progress</span>
                            </div>
                            <div className="flex flex-col gap-[6px]">
                                <div className="bg-white w-[346px] h-[60px] shadow-userStory p-[4px] box-border">

                                </div>
                                <div className="bg-white w-[346px] h-[60px] shadow-userStory p-[4px] box-border">
                                
                                </div>
                            </div>
                        </div>

                        <div className="h-[560px] w-[364px] bg-[#F3F7FF] rounded-[7px] p-[7px] box-border flex flex-col gap-6">
                            <div>
                                <span className="text-[16px] text-[#004A8E]">Done</span>
                            </div>
                            <div className="flex flex-col gap-[6px]">
                                <div className="bg-white w-[346px] h-[60px] shadow-userStory p-[4px] box-border">

                                </div>
                                <div className="bg-white w-[346px] h-[60px] shadow-userStory p-[4px] box-border">
                                
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Page>
        </Sidebar>
    );
}

export default Backlog;