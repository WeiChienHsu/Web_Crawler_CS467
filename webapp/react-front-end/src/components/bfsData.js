export const bfs = {
  url: "https://www.reddit.com/r/OSUOnlineCS/",
  name: "reddit",
  title: "reddit: the front page of the internet",
  children: [
    {
      url:
        "https://www.reddit.com/register/?dest=https%3A%2F%2Fwww.reddit.com%2Fr%2FOSUOnlineCS%2F",
      name: "reddit",
      title: "reddit.com: Join the worldwide conversation",
      nodeSvgShape: {
        shape: "rect",
        shapeProps: {
          width: 130,
          height: 30,
          x: 0,
          y: -20,
          fill: "lightblue"
        }
      },
      children: [
        {
          url: "https://www.reddit.com/help/useragreement",
          name: "reddit",
          title: "User Agreement - September 24, 2018 - Reddit",
          nodeSvgShape: {
            shape: "rect",
            shapeProps: {
              width: 130,
              height: 30,
              x: 0,
              y: -20,
              fill: "pink"
            }
          },
          children: null
        },
        {
          url: "https://www.reddit.com/help/privacypolicy/",
          name: "reddit",
          title: "Privacy Policy - May 25, 2018 - Reddit",
          children: null
        },
        {
          url: "https://www.reddit.com/help/contentpolicy/",
          name: "reddit",
          title: "Content Policy - Reddit",
          nodeSvgShape: {
            shape: "rect",
            shapeProps: {
              width: 130,
              height: 30,
              x: 0,
              y: -20,
              fill: "skyblue"
            }
          },
          children: null
        }
      ]
    }
  ]
};
