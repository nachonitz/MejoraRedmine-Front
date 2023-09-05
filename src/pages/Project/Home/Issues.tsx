import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Epic } from "../../../api/models/epic";
import { Issue } from "../../../api/models/issue";
import { Project } from "../../../api/models/project";
import { Release } from "../../../api/models/release";
import { Sprint } from "../../../api/models/sprint";
import { getEpicById } from "../../../api/services/epicsService";
import { deleteIssue } from "../../../api/services/issuesService";
import { getIssuesByEpicId } from "../../../api/services/projectsService";
import AddButton from "../../../components/Shared/Buttons/AddButton";
import SettingsButton from "../../../components/Shared/Buttons/SettingsButton";
import DeleteDialog from "../../../components/Shared/DeleteDialog/DeleteDialog";
import Page from "../../../components/Shared/Page/Page";
import PageTitle from "../../../components/Shared/Page/PageTitle/PageTitle";
import ProjectBreadcrumbs from "../../../components/Shared/ProjectBreadcrumbs/ProjectBreadcrumbs";
import Sidebar from "../../../components/Shared/Sidebar/Sidebar";

const ProjectIssues = () => {
  const { projectId, releaseId, sprintId, epicId } = useParams();
  const [project, setProject] = useState<Project>();
  const [release, setRelease] = useState<Release>();
  const [sprint, setSprint] = useState<Sprint>();
  const [epic, setEpic] = useState<Epic>();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [openCreateIssue, setOpenCreateIssue] = useState(false);
  const [openEditIssue, setOpenEditIssue] = useState(false);
  const [openDeleteIssue, setOpenDeleteIssue] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue>();

  const getEpic = useCallback(async () => {
    try {
      if (epicId) {
        const epic = await getEpicById(parseInt(epicId));
        setEpic(epic);
        console.log(epic);
        return epic;
      }
    } catch (error) {
      throw new Error("Error. Please try again.");
    }
  }, [epicId]);

  const getIssues = useCallback(async () => {
    try {
      if (epicId) {
        const issues = await getIssuesByEpicId(parseInt(epicId));
        setIssues(issues);
        console.log(issues);
        return issues;
      }
    } catch (error) {
      throw new Error("Error. Please try again.");
    }
  }, [epicId]);

  const goToIssue = (id: number) => {
    // navigate(`/project/${id}`);
    console.log(id);
  };

  const handleCloseCreateIssue = (refresh?: boolean) => {
    setOpenCreateIssue(false);
    if (refresh) {
      getIssues();
    }
  };

  const handleCloseEditIssue = (refresh?: boolean) => {
    setOpenEditIssue(false);
    if (refresh) {
      getIssues();
    }
    setSelectedIssue(undefined);
  };

  const handleCloseDeleteIssue = (refresh?: boolean) => {
    setOpenDeleteIssue(false);
    if (refresh) {
      getIssues();
    }
    setSelectedIssue(undefined);
  };

  useEffect(() => {
    getEpic();
    getIssues();
  }, [getEpic, getIssues]);

  return (
    <Sidebar>
      <Page>
        <ProjectBreadcrumbs
          project={epic?.project}
          release={epic?.release}
          sprint={epic?.sprint}
          epic={epic}
        />
        {/* <CreateEpicDialog projectId={projectId} releaseId={releaseId} sprintId={sprintId} open={openCreateEpic} handleClose={handleCloseCreateEpic} />
				<EditEpicDialog open={openEditEpic} epicId={selectedEpic?.id} handleClose={handleCloseEditEpic} /> */}
        <DeleteDialog
          open={openDeleteIssue}
          id={selectedIssue?.id}
          handleClose={handleCloseDeleteIssue}
          deleteFunction={deleteIssue}
          name={selectedIssue?.subject}
        />
        <div className="flex gap-[15px] items-center">
          <PageTitle title="Issues" />
          <AddButton />
        </div>
        <div>
          <table className="w-full mt-[30px]">
            <thead>
              <tr className="text-[18px] border-b-[1px] border-b-[#ccc] h-[40px]">
                <th></th>
                <th className="text-left">Name</th>
                <th className="text-left">Priority</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue: Issue) => (
                <tr
                  key={issue.id}
                  onClick={() => {
                    goToIssue(issue.id);
                  }}
                  className="text-[18px] h-[40px] cursor-pointer hover:bg-gray-50"
                >
                  <td className="w-[30px]">
                    <img
                      className="w-[24px] h-[24px]"
                      src={"/src/assets/icons/user-story-icon.png"}
                    />
                  </td>
                  <td className="gap-[10px] text-left">{issue.subject}</td>
                  <td className="text-left">{issue.priority["name"]}</td>
                  <td className="text-right">
                    <div className="flex justify-end">
                      <SettingsButton
                        onEdit={() => {
                          setSelectedIssue(issue);
                          setOpenEditIssue(true);
                        }}
                        onDelete={() => {
                          setSelectedIssue(issue);
                          setOpenDeleteIssue(true);
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {issues.length === 0 && (
            <div className="text-[18px] h-[40px] w-full text-center mt-2">
              <span className="text-center">There are no issues yet</span>
            </div>
          )}
        </div>
      </Page>
    </Sidebar>
  );
};

export default ProjectIssues;
