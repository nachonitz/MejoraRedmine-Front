import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import { Link as ReactRouterLink } from "react-router-dom";
import { Epic } from "../../../api/models/epic";
import { Project } from "../../../api/models/project";
import { Release } from "../../../api/models/release";
import { Sprint } from "../../../api/models/sprint";

interface ProjectBreadcrumbsProps {
  project?: Project;
  release?: Release;
  sprint?: Sprint;
  epic?: Epic;
}

const ProjectBreadcrumbs = ({
  project,
  release,
  sprint,
  epic,
}: ProjectBreadcrumbsProps) => {
  return (
    <div className="mb-5">
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          underline="hover"
          color="inherit"
          component={ReactRouterLink}
          to="/projects"
        >
          Projects
        </Link>
        {project && (
          <Link
            underline="hover"
            color="inherit"
            component={ReactRouterLink}
            to={`/project/${project.id}`}
          >
            {project.name}
          </Link>
        )}
        {release && project && (
          <Link
            underline="hover"
            color="inherit"
            component={ReactRouterLink}
            to={`/project/${project.id}/release/${release.id}`}
          >
            {release.name}
          </Link>
        )}
        {release && project && sprint && (
          <Link
            underline="hover"
            color="inherit"
            component={ReactRouterLink}
            to={`/project/${project.id}/release/${release.id}/sprint/${sprint.id}`}
          >
            {sprint.name}
          </Link>
        )}
        {release && project && sprint && epic && (
          <Link
            underline="hover"
            color="inherit"
            component={ReactRouterLink}
            to={`/project/${project.id}/release/${release.id}/sprint/${sprint.id}/epic/${epic.id}`}
          >
            {epic.name}
          </Link>
        )}
      </Breadcrumbs>
    </div>
  );
};

export default ProjectBreadcrumbs;
