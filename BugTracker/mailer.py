from django.core.mail import send_mail

class Mailer:
    def __init__(self):
        pass

    def newProjectStarted(self, project_name, project_creator, team_members=[]):
        crtr_name = project_creator.username
        for mem in team_members:
            name = mem.username
            email = mem.email

            text = f""" 
            Hi, {name}!
            {crtr_name} added you to the team of the project {project_name}!
            """

            html = f"""
            <html>
            <body>
            <h3> Hola {name}</h3>

            <div><b>{crtr_name}</b> added you to the team of the project <b>{project_name}</b> </div>
            Visit the Bug Tracker Site <a style=" font-size:16px;" href="http://localhost:3000/">here.</a>
            <br/>
            Congratulations on making into the Project.
            <br/>
            Regards, Team IMG        
            </body>
            </html>

            """
            send_mail(subject="New Project Started", message=text, from_email="BugTracker Bot", recipient_list= [email,], html_message=html)

    def updateProjectStatus(self, project_name, status, team_members=[]):
        for mem in team_members:
            name = mem.username
            email = mem.email

            text = f"""
            Hi, {name}!
            The status of the project {project_name} was updated!
            """

            html = f"""
            <html>
            <body>
            <h3> Hola {name}</h3>

            <div>Status of the project <b>{project_name}</b> was updated to {status}</div>
            Visit the Bug Tracker Site <a style=" font-size:16px;" href="http://localhost:3000/">here.</a>
            <br/>
            Regards, Team IMG
            </body>
            </html>
            """ 

            send_mail(subject="Project Status Updated", message=text, from_email="BugTracker Bot", recipient_list= [email,], html_message=html)

    def updateProjectWiki(self, project_name, wiki, team_members=[]):
        for mem in team_members:
            name = mem.username
            email = mem.email

            text = f"""
            Hi, {name}!
            The description of the project {project_name} was updated!
            """

            html = f"""
            <html>
            <body>
            <h3> Hola {name}</h3>

            <div>Description of the project <b>{project_name}</b> was updated.</div>
            Check it out <a style=" font-size:16px;" href="http://localhost:3000/">here.</a>
            <br/>
            Regards, Team IMG
            </body>
            </html>
            """ 

            send_mail(subject="Project Wiki Updated", message=text, from_email="BugTracker Bot", recipient_list= [email,], html_message=html)
        
    def updateProjectTeam(self, project_name, team_members=[]):
        for mem in team_members:
            name = mem.username
            email = mem.email

            text = f"""
            Hi, {name}!
            The team of the project {project_name} was updated!
            """

            html = f"""
            <html>
            <body>
            <h3> Hola {name}</h3>

            <div>The team of the project <b>{project_name}</b> was updated.</div>
            Check it out <a style=" font-size:16px;" href="http://localhost:3000/">here.</a>
            <br/>
            Regards, Team IMG
            </body>
            </html>
            """ 

            send_mail(subject="Project Team Updated", message=text, from_email="BugTracker Bot", recipient_list= [email,], html_message=html)

    def deleteProject(self, project_name, team_members=[]):
         for mem in team_members:
            name = mem.username
            email = mem.email

            text = f"""
            Hi, {name}!
            The project {project_name} was deleted!
            """

            html = f"""
            <html>
            <body>
            <h3> Hola {name}</h3>

            <div>The project <b>{project_name}</b> was deleted.</div>
            <br/>
            Regards, Team IMG
            </body>
            </html>
            """ 

            send_mail(subject="Project Team Updated", message=text, from_email="BugTracker Bot", recipient_list= [email,], html_message=html)

    def newIssueOpened(self, project_name, issue_title, reported_by, team_members=[]):
        reporter = reported_by.username
        for mem in team_members:
            name = mem.username
            email = mem.email

            text = f"""
            Hi, {name}!
            New Issue was found in the project {project_name}!
            """

            html = f"""
            <html>
            <body>
            <h3> Hola {name}</h3>

            <div>New Issue was found in the project <b>{project_name}</b> entitled <b>{issue_title}</b>. This issue was reported by {reporter}. Contact him/her for further details</div>
            Check it out <a style=" font-size:16px;" href="http://localhost:3000/">here,</a> and resolve it asap before it is assigned to someone else.
            <br/>
            Regards, Team IMG
            </body>
            </html>
            """ 

            send_mail(subject="New Issue found :(", message=text, from_email="BugTracker Bot", recipient_list= [email,], html_message=html)

    def assignIssue(self, issue, project_name, assignee, reported_by, team_members=[]):
        assignee_name = assignee.username
        for mem in team_members:
            name = mem.username
            email = mem.email

            text = f"""
            Hi, {name}!
            Issue found in {project_name} is assigned to {assignee_name}!
            """

            html = f"""
            <html>
            <body>
            <h3> Hola {name}</h3>

            <div>Issue <b>{issue.title}</b> in the project <b>{project_name}</b> is assigned to <b>{assignee_name}</b></div>
            Check it out <a style=" font-size:16px;" href="http://localhost:3000/">here,</a> and help him to resolve it asap.
            <br/>
            Regards, Team IMG
            </body>
            </html>
            """ 

            send_mail(subject="Assignment of the Issue", message=text, from_email="BugTracker Bot", recipient_list= [email,], html_message=html)
        text = f"""
            Hi, {reported_by.username}!
            Issue found in {project_name} is assigned to {assignee_name}!
            """

        html = f"""
            <html>
            <body>
            <h3> Hola {reported_by.username}</h3>

            <div>Issue <b>{issue.title}</b> in the project <b>{project_name}</b> is assigned to <b>{assignee_name}</b></div>
            Check it out <a style=" font-size:16px;" href="http://localhost:3000/">here,</a> and help him to resolve it asap.
            <br/>
            Regards, Team IMG
            </body>
            </html>
            """ 
        send_mail(subject="Issue reported by you is now assigned", message=text, from_email="BugTracker Bot", recipient_list= [reported_by.email,], html_message=html)

    def closeIssue(self, issue, project_name, reported_by, team_members=[]):
        for mem in team_members:
            name = mem.username
            email = mem.email

            text = f"""
            Hi, {name}!
            Issue found in {project_name} is resolved :) !
            """

            html = f"""
            <html>
            <body>
            <h3> Hola {name}</h3>

            <div>Issue <b>{issue.title}</b> in the project <b>{project_name}</b> is now resolved.</div>
            <br/>
            Regards, Team IMG
            </body>
            </html>
            """ 

            send_mail(subject="Issue found in the Project is resolved", message=text, from_email="BugTracker Bot", recipient_list= [email,], html_message=html)
        text = f"""
            Hi, {reported_by.username}!
            Issue found in {project_name} is resolved :) !
            """

        html = f"""
            <html>
            <body>
            <h3> Hola {reported_by.username}</h3>

            <div>Issue <b>{issue.title}</b> in the project <b>{project_name}</b> is now resolved.</div>
            <br/>
            Regards, Team IMG
            </body>
            </html>
            """ 
        send_mail(subject="Issue reported by you is now resolved", message=text, from_email="BugTracker Bot", recipient_list= [reported_by.email,], html_message=html)

    def deleteIssue(self, issue, project_name, reported_by, team_members=[]):
        for mem in team_members:
            name = mem.username
            email = mem.email

            text = f"""
            Hi, {name}!
            Issue found in {project_name} is deleted!
            """

            html = f"""
            <html>
            <body>
            <h3> Hola {name}</h3>

            <div>Issue <b>{issue.title}</b> in the project <b>{project_name}</b> is now deleted.</div>
            <br/>
            Regards, Team IMG
            </body>
            </html>
            """ 

            send_mail(subject="Issue found in the Project is deleted", message=text, from_email="BugTracker Bot", recipient_list= [email,], html_message=html)
        text = f"""
            Hi, {reported_by.username}!
            Issue found in {project_name} is deleted!
            """

        html = f"""
            <html>
            <body>
            <h3> Hola {reported_by.username}</h3>

            <div>Issue <b>{issue.title}</b> in the project <b>{project_name}</b> is now deleted.</div>
            <br/>
            Regards, Team IMG
            </body>
            </html>
            """ 
        send_mail(subject="Issue reported by you is deleted", message=text, from_email="BugTracker Bot", recipient_list= [reported_by.email,], html_message=html)

    def newComment(self, issue, project_name, reported_by, commented_by, team_members=[]):
        for mem in team_members:
            name = mem.username
            email = mem.email

            text = f"""
            Hi, {name}!
            New comment on the issue {issue.title} in {project_name} by {commented_by.username}!
            """

            html = f"""
            <html>
            <body>
            <h3> Hola {name}</h3>

            <div> New Comment on the Issue <b>{issue.title}</b> in the project <b>{project_name}</b> by {commented_by.username}.</div>
            Check it out <a style=" font-size:16px;" href="http://localhost:3000/">here.</a> 
            <br/>
            Regards, Team IMG
            </body>
            </html>
            """ 

            send_mail(subject="New Comment on the Issue found in the project", message=text, from_email="BugTracker Bot", recipient_list= [email,], html_message=html)
        text = f"""
            Hi, {reported_by.username}!
            New Comment on issue found in {project_name} by {commented_by.username}!
            """

        html = f"""
            <html>
            <body>
            <h3> Hola {reported_by.username}</h3>
            <br/>
            <div> New Comment on the Issue <b>{issue.title}</b> in the project <b>{project_name}</b> by {commented_by.username}.</div>            Check it out <a style=" font-size:16px;" href="http://localhost:3000/">here.</a> 
            <br/>
            Regards, Team IMG
            </body>
            </html>
            """ 
        send_mail(subject="New Comment on the Issue found in the project", message=text, from_email="BugTracker Bot", recipient_list= [reported_by.email,], html_message=html)



    

        
