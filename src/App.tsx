import { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Shared/Header/Header";
import { UserContext } from "./context/UserContext";
import Login from "./pages/Login";
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
                                path="/project/:projectId/settings"
                                element={<Settings />}
                            />
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
