import { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Shared/Header/Header";
import { UserContext } from "./context/UserContext";
import Login from "./pages/Login";
import Backlog from "./pages/Project/Backlog/Backlog";
import Documents from "./pages/Project/Documents/Documents";
import NewDocument from "./pages/Project/Documents/NewDocument";
import ProjectEpics from "./pages/Project/Home/Epics";
import ProjectIssues from "./pages/Project/Home/Issues";
import ProjectReleases from "./pages/Project/Home/Releases";
import ProjectSprints from "./pages/Project/Home/Sprints";
import Risks from "./pages/Project/Risks/Risks";
import Settings from "./pages/Project/Settings/Settings";
import Projects from "./pages/Projects";
import Register from "./pages/Register";
import EditDocument from "./pages/Project/Documents/EditDocument";
import SingleDocument from "./pages/Project/Documents/SingleDocument";
import { hasAdminAccess } from "./lib/utils";
import Information from "./pages/Admin/Information";
import Users from "./pages/Admin/Users";
import Profile from "./pages/Profile/Profile";
import Dashboard from "./pages/Project/Dashboard/Dashboard";

function App() {
    const { isLoggedIn } = useContext(UserContext);

    return (
        <>
            <Header />
            <div className="flex flex-column mt-[64px]">
                <Routes>
                    {isLoggedIn ? (
                        <>
                            <Route path="/" element={<Projects />} />
                            <Route path="/projects" element={<Projects />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route
                                path="/project/:projectId"
                                element={<ProjectReleases />}
                            />
                            <Route
                                path="/project/:projectId/release/:releaseId"
                                element={<ProjectSprints />}
                            />
                            <Route
                                path="/project/:projectId/release/:releaseId/sprint/:sprintId"
                                element={<ProjectEpics />}
                            />
                            <Route
                                path="/project/:projectId/release/:releaseId/sprint/:sprintId/epic/:epicId"
                                element={<ProjectIssues />}
                            />
                            <Route
                                path="/project/:projectId/risks"
                                element={<Risks />}
                            />
                            <Route
                                path="/project/:projectId/documents"
                                element={<Documents />}
                            />
                            <Route
                                path="/project/:projectId/documents/new"
                                element={<NewDocument />}
                            />

                            <Route
                                path="/project/:projectId/document/:documentId"
                                element={<SingleDocument />}
                            />
                            <Route
                                path="/project/:projectId/document/:documentId/edit"
                                element={<EditDocument />}
                            />
                            <Route
                                path="/project/:projectId/settings"
                                element={<Settings />}
                            />
                            <Route
                                path="/project/:projectId/dashboard"
                                element={<Dashboard />}
                            />
                            <Route
                                path="/project/:projectId/backlog"
                                element={<Backlog />}
                            />
                            {hasAdminAccess() && (
                                <>
                                    <Route
                                        path="/admin/information"
                                        element={<Information />}
                                    />
                                    <Route
                                        path="/admin/users"
                                        element={<Users />}
                                    />
                                    <Route
                                        path="/admin"
                                        element={
                                            <Navigate to="/admin/information" />
                                        }
                                    />
                                </>
                            )}
                            <Route path="*" element={<Navigate to="/" />} />
                        </>
                    ) : (
                        <>
                            <Route
                                path="/"
                                element={<Navigate to="/login" />}
                            />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                        </>
                    )}
                </Routes>
            </div>
        </>
    );
}

export default App;
